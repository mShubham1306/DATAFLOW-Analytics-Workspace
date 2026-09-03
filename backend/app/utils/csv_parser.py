import csv
import io
from typing import Generator, List, Dict, Any

REQUIRED_COLUMNS = {"name", "email", "phone", "company", "city"}


class CSVValidationError(Exception):
    """Custom exception raised when CSV format or headers are invalid."""
    pass


def validate_csv_headers(stream: io.StringIO) -> List[str]:
    """
    Reads header of CSV stream and ensures all required columns exist.
    Resets stream position afterwards.
    """
    stream.seek(0)
    reader = csv.reader(stream)
    try:
        header_row = next(reader)
    except StopIteration:
        raise CSVValidationError("The uploaded CSV file is empty.")
    except Exception as e:
        raise CSVValidationError(f"Failed to read CSV header: {str(e)}")

    if not header_row:
        raise CSVValidationError("The uploaded CSV file is empty or missing headers.")

    normalized_headers = [h.strip().lower() for h in header_row if h and h.strip()]
    header_set = set(normalized_headers)

    missing = REQUIRED_COLUMNS - header_set
    if missing:
        missing_str = ", ".join(sorted(list(missing)))
        required_str = ", ".join(sorted(list(REQUIRED_COLUMNS)))
        raise CSVValidationError(
            f"CSV file is missing required header column(s): [{missing_str}]. "
            f"The required columns are: [{required_str}]."
        )

    stream.seek(0)
    return normalized_headers


def stream_csv_batches(
    stream: io.StringIO, batch_size: int = 1000
) -> Generator[List[Dict[str, Any]], None, None]:
    """
    Streams CSV rows in memory-efficient batches of specified batch_size.
    Yields list of dict rows with row_number attached.
    """
    stream.seek(0)
    reader = csv.DictReader(stream)
    batch = []
    # DictReader starts at line 2 (line 1 is header)
    row_number = 1

    for row in reader:
        row_number += 1
        # Skip completely empty lines
        if not any(row.values()):
            continue
        
        row["_row_number"] = row_number
        batch.append(row)

        if len(batch) >= batch_size:
            yield batch
            batch = []

    if batch:
        yield batch
