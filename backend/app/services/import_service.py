import io
import csv
from typing import Generator
from sqlalchemy.orm import Session

from app.models.import_job import JobStatus
from app.repositories.import_repository import ImportRepository
from app.utils.csv_parser import validate_csv_headers, stream_csv_batches, CSVValidationError
from app.utils.validators import normalize_row, validate_row


class ImportService:

    @staticmethod
    def process_import_job(job_id: str, file_contents: bytes, db: Session):
        """
        Background task to process uploaded CSV file:
        1. Parse stream & validate headers
        2. Stream in batches (O(batch) RAM)
        3. Validate each row & detect duplicates (O(N) HashSet)
        4. Bulk insert records into DB
        5. Update job metrics & status
        """
        # Set job status to PROCESSING
        ImportRepository.update_job_status(db, job_id, JobStatus.PROCESSING)

        try:
            # Decode file contents
            text_stream = io.StringIO(file_contents.decode("utf-8-sig", errors="replace"))

            # Pre-flight header validation
            validate_csv_headers(text_stream)

            seen_emails = set()
            total_records = 0
            valid_records = 0
            invalid_records = 0
            duplicate_count = 0

            # Stream & process in batches of 1000
            for batch in stream_csv_batches(text_stream, batch_size=1000):
                db_records = []
                for row_data in batch:
                    row_num = row_data.get("_row_number", total_records + 2)
                    normalized = normalize_row(row_data)

                    is_valid, is_duplicate, reasons, cleaned_data = validate_row(
                        normalized, seen_emails
                    )

                    total_records += 1
                    if is_valid:
                        valid_records += 1
                    else:
                        invalid_records += 1

                    if is_duplicate:
                        duplicate_count += 1

                    db_records.append({
                        "job_id": job_id,
                        "row_number": row_num,
                        "name": cleaned_data["name"],
                        "email": cleaned_data["email"],
                        "phone": cleaned_data["phone"],
                        "company": cleaned_data["company"],
                        "city": cleaned_data["city"],
                        "is_valid": is_valid,
                        "is_duplicate": is_duplicate,
                        "validation_reasons": reasons,
                    })

                # Bulk insert current batch
                ImportRepository.bulk_insert_records(db, db_records)

                # Periodically update progress counts
                ImportRepository.update_job_counts(
                    db,
                    job_id,
                    total=total_records,
                    valid=valid_records,
                    invalid=invalid_records,
                    duplicates=duplicate_count,
                    completed=False
                )

            # Mark as COMPLETED upon full processing
            ImportRepository.update_job_counts(
                db,
                job_id,
                total=total_records,
                valid=valid_records,
                invalid=invalid_records,
                duplicates=duplicate_count,
                completed=True
            )

        except CSVValidationError as e:
            ImportRepository.update_job_status(db, job_id, JobStatus.FAILED, error_message=str(e))
        except Exception as e:
            error_msg = f"Unexpected processing error: {str(e)}"
            ImportRepository.update_job_status(db, job_id, JobStatus.FAILED, error_message=error_msg)

    @staticmethod
    def generate_valid_csv_stream(job_id: str, db: Session) -> Generator[str, None, None]:
        """
        Yields CSV text lines for streaming valid records download.
        """
        output = io.StringIO()
        writer = csv.writer(output)

        # Write CSV Header
        writer.writerow(["Name", "Email", "Phone", "Company", "City"])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)

        # Stream valid records in chunks from DB
        for record_chunk in ImportRepository.get_valid_records_generator(db, job_id, chunk_size=1000):
            for rec in record_chunk:
                writer.writerow([rec.name or "", rec.email or "", rec.phone or "", rec.company or "", rec.city or ""])
                yield output.getvalue()
                output.seek(0)
                output.truncate(0)
