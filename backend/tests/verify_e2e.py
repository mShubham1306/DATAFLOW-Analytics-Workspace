import os
import sys
import time

# Force UTF-8 encoding for Windows stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient

# Add app directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database import Base, engine

def run_full_e2e_verification():
    print("=" * 70)
    print("ONEPRISM CSV IMPORTER - END-TO-END RUNTIME VERIFICATION")
    print("=" * 70)

    # 1. Initialize Tables
    print("\n[STEP 1] Initializing SQLite database schema...")
    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    print("  [OK] Database tables ready.")

    # 2. Read sample.csv
    sample_csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../sample.csv"))
    print(f"\n[STEP 2] Loading sample dataset from: {sample_csv_path}")
    with open(sample_csv_path, "rb") as f:
        file_bytes = f.read()

    # 3. Upload CSV
    print("\n[STEP 3] Triggering POST /api/imports multipart upload...")
    upload_res = client.post(
        "/api/imports",
        files={"file": ("sample.csv", file_bytes, "text/csv")}
    )
    assert upload_res.status_code == 202, f"Upload failed: {upload_res.text}"
    job_id = upload_res.json()["job_id"]
    print(f"  [OK] Upload accepted! Job ID assigned: {job_id}")

    # 4. Poll Job Status
    print("\n[STEP 4] Polling job status (GET /api/imports/{job_id})...")
    job_data = {}
    for i in range(15):
        res = client.get(f"/api/imports/{job_id}")
        assert res.status_code == 200
        job_data = res.json()
        print(f"  Poll #{i+1}: Status = {job_data['status']}")
        if job_data["status"] in ("COMPLETED", "FAILED"):
            break
        time.sleep(0.1)

    assert job_data["status"] == "COMPLETED", f"Job failed: {job_data.get('error_message')}"
    print(f"\n  Summary Metrics Breakdown:")
    print(f"     - Total Records:   {job_data['total_records']}")
    print(f"     - Valid Records:   {job_data['valid_records']}")
    print(f"     - Invalid Records: {job_data['invalid_records']}")
    print(f"     - Duplicates:      {job_data['duplicate_count']}")

    # 5. Verify Pagination, Search, and Status Filtering
    print("\n[STEP 5] Testing Records API filtering & pagination...")
    
    # All records
    all_res = client.get(f"/api/imports/{job_id}/records?page=1&limit=50&status=all")
    assert all_res.status_code == 200
    all_records = all_res.json()
    print(f"  [OK] GET status=all: Returned {all_records['total']} total items across {all_records['total_pages']} pages.")

    # Valid records
    valid_res = client.get(f"/api/imports/{job_id}/records?page=1&limit=50&status=valid")
    assert valid_res.status_code == 200
    valid_records = valid_res.json()
    print(f"  [OK] GET status=valid: Returned {valid_records['total']} valid items.")
    assert valid_records['total'] == job_data['valid_records']

    # Invalid records
    invalid_res = client.get(f"/api/imports/{job_id}/records?page=1&limit=50&status=invalid")
    assert invalid_res.status_code == 200
    invalid_records = invalid_res.json()
    print(f"  [OK] GET status=invalid: Returned {invalid_records['total']} invalid items.")
    assert invalid_records['total'] == job_data['invalid_records']

    # Inspect invalid reasons on first invalid record
    first_invalid = invalid_records["items"][0]
    print(f"\n  Sample Invalid Record Inspection (Row #{first_invalid['row_number']}):")
    print(f"     Name: '{first_invalid['name']}' | Email: '{first_invalid['email']}' | Phone: '{first_invalid['phone']}'")
    print(f"     Reasons: {[r['message'] for r in first_invalid['validation_reasons']]}")

    # Search query
    search_res = client.get(f"/api/imports/{job_id}/records?search=Acme")
    assert search_res.status_code == 200
    search_records = search_res.json()
    print(f"  [OK] Search query 'Acme': Matched {search_records['total']} records.")

    # 5b. Verify Analytics API
    print("\n[STEP 5b] Testing Power BI Analytics API (GET /api/imports/{job_id}/analytics)...")
    analytics_res = client.get(f"/api/imports/{job_id}/analytics")
    assert analytics_res.status_code == 200
    analytics_data = analytics_res.json()
    print(f"  [OK] Quality Score: {analytics_data['summary']['quality_score']}%")
    print(f"  [OK] Completeness Score: {analytics_data['summary']['completeness_score']}%")
    print(f"  [OK] Top Companies Breakdown: {len(analytics_data['records_by_company'])} companies found.")
    print(f"  [OK] Top Cities Breakdown: {len(analytics_data['records_by_city'])} cities found.")
    print(f"  [OK] Validation Errors Count: {len(analytics_data['validation_errors'])} distinct issue types.")

    # 6. Stream Download Valid CSV
    print("\n[STEP 6] Testing Streaming Download (GET /api/imports/{job_id}/download)...")
    dl_res = client.get(f"/api/imports/{job_id}/download")
    assert dl_res.status_code == 200
    assert "text/csv" in dl_res.headers["content-type"]
    dl_lines = dl_res.text.strip().split("\n")
    header = dl_lines[0]
    data_lines = dl_lines[1:]
    print(f"  [OK] CSV Header received: {header}")
    print(f"  [OK] Downloaded CSV contains {len(data_lines)} valid customer rows.")
    assert len(data_lines) == job_data['valid_records']

    # 7. Check History Persistence
    print("\n[STEP 7] Testing Import History Persistence (GET /api/imports)...")
    history_res = client.get("/api/imports")
    assert history_res.status_code == 200
    history_list = history_res.json()
    print(f"  [OK] History contains {len(history_list)} previous job(s). Latest job ID: {history_list[0]['id']}")

    print("\n" + "=" * 70)
    print("END-TO-END RUNTIME VERIFICATION SUCCESSFUL!")
    print("=" * 70)

if __name__ == "__main__":
    run_full_e2e_verification()
