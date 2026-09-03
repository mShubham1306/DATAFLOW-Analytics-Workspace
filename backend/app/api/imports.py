from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query, BackgroundTasks, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.database import get_db, SessionLocal
from app.models.import_job import JobStatus
from app.schemas.import_schema import (
    ImportJobResponse,
    JobUploadResponse,
    PaginatedRecordsResponse,
    ImportRecordResponse,
)
from app.repositories.import_repository import ImportRepository
from app.services.import_service import ImportService

router = APIRouter(prefix="/api/imports", tags=["Imports"])


def run_background_import(job_id: str, file_contents: bytes):
    """
    Background worker thread runner using dedicated database session.
    """
    db = SessionLocal()
    try:
        ImportService.process_import_job(job_id, file_contents, db)
    finally:
        db.close()


@router.post("", response_model=JobUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload CSV file and launch background import job.
    Returns unique job_id immediately.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot be empty."
        )

    if not (file.filename.lower().endswith(".csv") or file.content_type in ("text/csv", "application/vnd.ms-excel", "text/plain")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a valid .csv file."
        )

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded CSV file is empty (0 bytes)."
        )

    # Create job entry with PENDING status
    job = ImportRepository.create_job(db, file.filename)

    # Enqueue processing task
    background_tasks.add_task(run_background_import, job.id, contents)

    return JobUploadResponse(
        job_id=job.id,
        filename=job.filename,
        status=job.status,
        message="CSV import job initiated successfully."
    )


@router.get("", response_model=List[ImportJobResponse])
def get_import_history(db: Session = Depends(get_db)):
    """Retrieve list of all previous import jobs."""
    return ImportRepository.get_all_jobs(db)


@router.get("/{job_id}", response_model=ImportJobResponse)
def get_import_job(job_id: str, db: Session = Depends(get_db)):
    """Get import job status, progress, and metrics summary."""
    job = ImportRepository.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job '{job_id}' not found."
        )
    return job


@router.get("/{job_id}/records", response_model=PaginatedRecordsResponse)
def get_import_records(
    job_id: str,
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=200, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term for name, email, company, city"),
    status: Optional[str] = Query("all", description="Status filter: all, valid, invalid"),
    company: Optional[str] = Query("all", description="Company filter"),
    city: Optional[str] = Query("all", description="City filter"),
    error_type: Optional[str] = Query("all", description="Validation error type filter"),
    db: Session = Depends(get_db)
):
    """Retrieve paginated and filtered import records for a specific job."""
    job = ImportRepository.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job '{job_id}' not found."
        )

    records, total_count = ImportRepository.get_paginated_records(
        db,
        job_id=job_id,
        page=page,
        limit=limit,
        search=search,
        status_filter=status,
        company=company,
        city=city,
        error_type=error_type,
    )

    total_pages = math.ceil(total_count / limit) if total_count > 0 else 1

    return PaginatedRecordsResponse(
        items=[ImportRecordResponse.model_validate(r) for r in records],
        page=page,
        limit=limit,
        total=total_count,
        total_pages=total_pages
    )


@router.get("/{job_id}/analytics")
def get_import_analytics(
    job_id: str,
    company: Optional[str] = Query("all"),
    city: Optional[str] = Query("all"),
    status: Optional[str] = Query("all"),
    db: Session = Depends(get_db)
):
    """Retrieve Power BI style analytical aggregations for a specific job."""
    job = ImportRepository.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job '{job_id}' not found."
        )

    analytics = ImportRepository.get_job_analytics(
        db,
        job_id=job_id,
        company=company,
        city=city,
        status_filter=status
    )
    return analytics


@router.get("/{job_id}/download")
def download_valid_records(job_id: str, db: Session = Depends(get_db)):
    """Stream valid records as downloadable CSV file."""
    job = ImportRepository.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job '{job_id}' not found."
        )

    if job.status == JobStatus.FAILED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot download records for a failed import job."
        )

    export_filename = f"valid_{job.filename}"
    return StreamingResponse(
        ImportService.generate_valid_csv_stream(job_id, db),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{export_filename}"'}
    )


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_import_job(job_id: str, db: Session = Depends(get_db)):
    """Delete an import job and all associated records."""
    job = ImportRepository.get_job(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Import job '{job_id}' not found."
        )
    db.delete(job)
    db.commit()
    return None
