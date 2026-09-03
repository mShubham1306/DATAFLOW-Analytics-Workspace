from sqlalchemy.orm import Session
from sqlalchemy import or_, func, String
from typing import List, Optional, Tuple, Generator
from datetime import datetime, timezone
from app.models.import_job import ImportJob, JobStatus
from app.models.import_record import ImportRecord


def utc_now():
    return datetime.now(timezone.utc)


class ImportRepository:

    @staticmethod
    def create_job(db: Session, filename: str) -> ImportJob:
        job = ImportJob(
            filename=filename,
            status=JobStatus.PENDING,
            created_at=utc_now()
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_job(db: Session, job_id: str) -> Optional[ImportJob]:
        return db.query(ImportJob).filter(ImportJob.id == job_id).first()

    @staticmethod
    def get_all_jobs(db: Session) -> List[ImportJob]:
        return db.query(ImportJob).order_by(ImportJob.created_at.desc()).all()

    @staticmethod
    def update_job_status(
        db: Session,
        job_id: str,
        status: JobStatus,
        error_message: Optional[str] = None
    ) -> Optional[ImportJob]:
        job = db.query(ImportJob).filter(ImportJob.id == job_id).first()
        if job:
            job.status = status
            if error_message is not None:
                job.error_message = error_message
            if status in (JobStatus.COMPLETED, JobStatus.FAILED):
                job.completed_at = utc_now()
            db.commit()
            db.refresh(job)
        return job

    @staticmethod
    def bulk_insert_records(db: Session, records_data: List[dict]):
        if not records_data:
            return
        db.bulk_insert_mappings(ImportRecord, records_data)
        db.commit()

    @staticmethod
    def update_job_counts(
        db: Session,
        job_id: str,
        total: int,
        valid: int,
        invalid: int,
        duplicates: int,
        completed: bool = False
    ):
        job = db.query(ImportJob).filter(ImportJob.id == job_id).first()
        if job:
            job.total_records = total
            job.valid_records = valid
            job.invalid_records = invalid
            job.duplicate_count = duplicates
            if completed:
                job.status = JobStatus.COMPLETED
                job.completed_at = utc_now()
            db.commit()

    @staticmethod
    def get_paginated_records(
        db: Session,
        job_id: str,
        page: int = 1,
        limit: int = 50,
        search: Optional[str] = None,
        status_filter: Optional[str] = None,
        company: Optional[str] = None,
        city: Optional[str] = None,
        error_type: Optional[str] = None,
    ) -> Tuple[List[ImportRecord], int]:
        query = db.query(ImportRecord).filter(ImportRecord.job_id == job_id)

        # Status filter
        if status_filter == "valid":
            query = query.filter(ImportRecord.is_valid == True)
        elif status_filter == "invalid":
            query = query.filter(ImportRecord.is_valid == False)

        # Company filter
        if company and company != "all":
            query = query.filter(ImportRecord.company == company)

        # City filter
        if city and city != "all":
            query = query.filter(ImportRecord.city == city)

        # Search text filter across name, email, company, city
        if search and search.strip():
            search_term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    ImportRecord.name.ilike(search_term),
                    ImportRecord.email.ilike(search_term),
                    ImportRecord.company.ilike(search_term),
                    ImportRecord.city.ilike(search_term),
                )
            )

        # In-memory or SQL error_type filter if specified
        if error_type and error_type != "all":
            # For SQLite JSON string matching
            query = query.filter(ImportRecord.validation_reasons.cast(String).contains(error_type))

        total_count = query.count()
        offset = (page - 1) * limit

        records = query.order_by(ImportRecord.row_number.asc()).offset(offset).limit(limit).all()
        return records, total_count

    @staticmethod
    def get_valid_records_generator(
        db: Session, job_id: str, chunk_size: int = 1000
    ) -> Generator[List[ImportRecord], None, None]:
        """Yields chunks of valid records for streaming CSV output."""
        offset = 0
        while True:
            records = (
                db.query(ImportRecord)
                .filter(ImportRecord.job_id == job_id, ImportRecord.is_valid == True)
                .order_by(ImportRecord.row_number.asc())
                .offset(offset)
                .limit(chunk_size)
                .all()
            )
            if not records:
                break
            yield records
            offset += chunk_size

    @staticmethod
    def get_job_analytics(
        db: Session,
        job_id: str,
        company: Optional[str] = None,
        city: Optional[str] = None,
        status_filter: Optional[str] = None
    ) -> dict:
        """
        Computes Power BI-grade analytics via SQL aggregations on import records.
        """
        base_query = db.query(ImportRecord).filter(ImportRecord.job_id == job_id)

        if company and company != "all":
            base_query = base_query.filter(ImportRecord.company == company)
        if city and city != "all":
            base_query = base_query.filter(ImportRecord.city == city)
        if status_filter == "valid":
            base_query = base_query.filter(ImportRecord.is_valid == True)
        elif status_filter == "invalid":
            base_query = base_query.filter(ImportRecord.is_valid == False)

        all_records = base_query.all()
        total_records = len(all_records)

        if total_records == 0:
            return {
                "summary": {
                    "total_records": 0,
                    "valid_records": 0,
                    "invalid_records": 0,
                    "duplicate_count": 0,
                    "quality_score": 0.0,
                    "completeness_score": 0.0,
                    "unique_companies": 0,
                    "unique_cities": 0,
                },
                "completeness": {
                    "name": 0.0,
                    "email": 0.0,
                    "phone": 0.0,
                    "company": 0.0,
                    "city": 0.0,
                },
                "validation_errors": [],
                "records_by_company": [],
                "records_by_city": [],
                "duplicate_analysis": {
                    "unique_emails": 0,
                    "duplicate_emails": 0,
                    "unique_percentage": 0.0,
                    "duplicate_percentage": 0.0,
                    "top_repeated_emails": [],
                },
                "available_companies": [],
                "available_cities": [],
            }

        valid_count = 0
        invalid_count = 0
        duplicate_count = 0

        name_count = 0
        email_count = 0
        phone_count = 0
        company_count = 0
        city_count = 0

        error_counts = {}
        company_stats = {}
        city_stats = {}
        email_frequencies = {}

        for rec in all_records:
            if rec.is_valid:
                valid_count += 1
            else:
                invalid_count += 1

            if rec.is_duplicate:
                duplicate_count += 1

            if rec.name and rec.name.strip():
                name_count += 1
            if rec.email and rec.email.strip():
                email_count += 1
                email_frequencies[rec.email] = email_frequencies.get(rec.email, 0) + 1
            if rec.phone and rec.phone.strip():
                phone_count += 1
            if rec.company and rec.company.strip():
                company_count += 1
            if rec.city and rec.city.strip():
                city_count += 1

            # Company breakdown
            comp_name = rec.company.strip() if rec.company and rec.company.strip() else "(Unspecified)"
            if comp_name not in company_stats:
                company_stats[comp_name] = {"company": comp_name, "total": 0, "valid": 0, "invalid": 0}
            company_stats[comp_name]["total"] += 1
            if rec.is_valid:
                company_stats[comp_name]["valid"] += 1
            else:
                company_stats[comp_name]["invalid"] += 1

            # City breakdown
            c_name = rec.city.strip() if rec.city and rec.city.strip() else "(Unspecified)"
            if c_name not in city_stats:
                city_stats[c_name] = {"city": c_name, "total": 0, "valid": 0, "invalid": 0}
            city_stats[c_name]["total"] += 1
            if rec.is_valid:
                city_stats[c_name]["valid"] += 1
            else:
                city_stats[c_name]["invalid"] += 1

            # Validation errors
            if not rec.is_valid and rec.validation_reasons:
                for reason in rec.validation_reasons:
                    code = reason.get("code", "UNKNOWN_ERROR")
                    msg = reason.get("message", code)
                    if code not in error_counts:
                        error_counts[code] = {"type": code, "message": msg, "count": 0}
                    error_counts[code]["count"] += 1

        quality_score = round((valid_count / total_records) * 100, 1)

        completeness = {
            "name": round((name_count / total_records) * 100, 1),
            "email": round((email_count / total_records) * 100, 1),
            "phone": round((phone_count / total_records) * 100, 1),
            "company": round((company_count / total_records) * 100, 1),
            "city": round((city_count / total_records) * 100, 1),
        }
        avg_completeness = round(sum(completeness.values()) / len(completeness), 1)

        # Company list sorted by total count
        sorted_companies = sorted(company_stats.values(), key=lambda x: x["total"], reverse=True)
        for comp in sorted_companies:
            comp["validity_rate"] = round((comp["valid"] / comp["total"]) * 100, 1) if comp["total"] > 0 else 0

        # City list sorted by total count
        sorted_cities = sorted(city_stats.values(), key=lambda x: x["total"], reverse=True)
        for c in sorted_cities:
            c["validity_rate"] = round((c["valid"] / c["total"]) * 100, 1) if c["total"] > 0 else 0

        # Repeated emails
        top_repeated = [
            {"email": em, "count": cnt}
            for em, cnt in sorted(email_frequencies.items(), key=lambda x: x[1], reverse=True)
            if cnt > 1
        ][:5]

        # Available filters for dropdowns
        all_job_records = db.query(ImportRecord).filter(ImportRecord.job_id == job_id).all()
        avail_companies = sorted(list(set(r.company.strip() for r in all_job_records if r.company and r.company.strip())))
        avail_cities = sorted(list(set(r.city.strip() for r in all_job_records if r.city and r.city.strip())))

        return {
            "summary": {
                "total_records": total_records,
                "valid_records": valid_count,
                "invalid_records": invalid_count,
                "duplicate_count": duplicate_count,
                "quality_score": quality_score,
                "completeness_score": avg_completeness,
                "unique_companies": len(company_stats),
                "unique_cities": len(city_stats),
            },
            "completeness": completeness,
            "validation_errors": sorted(error_counts.values(), key=lambda x: x["count"], reverse=True),
            "records_by_company": sorted_companies[:10],
            "records_by_city": sorted_cities[:10],
            "duplicate_analysis": {
                "unique_emails": len(email_frequencies),
                "duplicate_emails": duplicate_count,
                "unique_percentage": round(((len(email_frequencies)) / total_records) * 100, 1) if total_records > 0 else 0,
                "duplicate_percentage": round((duplicate_count / total_records) * 100, 1) if total_records > 0 else 0,
                "top_repeated_emails": top_repeated,
            },
            "available_companies": avail_companies,
            "available_cities": avail_cities,
        }

