from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.models.import_job import JobStatus


class ValidationReasonSchema(BaseModel):
    field: str
    code: str
    message: str


class ImportRecordResponse(BaseModel):
    id: int
    job_id: str
    row_number: int
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    city: Optional[str] = None
    is_valid: bool
    is_duplicate: bool
    validation_reasons: List[ValidationReasonSchema] = []

    model_config = ConfigDict(from_attributes=True)


class ImportJobResponse(BaseModel):
    id: str
    filename: str
    status: JobStatus
    total_records: int
    valid_records: int
    invalid_records: int
    duplicate_count: int
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class JobUploadResponse(BaseModel):
    job_id: str
    filename: str
    status: JobStatus
    message: str


class PaginatedRecordsResponse(BaseModel):
    items: List[ImportRecordResponse]
    page: int
    limit: int
    total: int
    total_pages: int
