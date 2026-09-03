import pytest
import time
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_upload_valid_csv():
    csv_content = (
        "name,email,phone,company,city\n"
        "John Doe,john@example.com,555-0101,Acme Inc,Seattle\n"
        "Jane Smith,jane@example.com,555-0102,Beta LLC,Chicago\n"
    )

    response = client.post(
        "/api/imports",
        files={"file": ("customers.csv", csv_content, "text/csv")}
    )
    assert response.status_code == 202
    data = response.json()
    assert "job_id" in data
    job_id = data["job_id"]

    # Poll status until completed
    job_data = {}
    for _ in range(20):
        res = client.get(f"/api/imports/{job_id}")
        assert res.status_code == 200
        job_data = res.json()
        if job_data["status"] in ("COMPLETED", "FAILED"):
            break
        time.sleep(0.1)

    assert job_data["status"] == "COMPLETED"
    assert job_data["total_records"] == 2
    assert job_data["valid_records"] == 2
    assert job_data["invalid_records"] == 0

    # Retrieve records
    rec_res = client.get(f"/api/imports/{job_id}/records")
    assert rec_res.status_code == 200
    records = rec_res.json()
    assert records["total"] == 2
    assert len(records["items"]) == 2


def test_upload_invalid_csv_missing_headers():
    bad_csv = "name,email,phone\nJohn,john@example.com,555-0101\n"
    response = client.post(
        "/api/imports",
        files={"file": ("bad.csv", bad_csv, "text/csv")}
    )
    assert response.status_code == 202
    job_id = response.json()["job_id"]

    job_data = {}
    for _ in range(20):
        res = client.get(f"/api/imports/{job_id}")
        assert res.status_code == 200
        job_data = res.json()
        if job_data["status"] in ("COMPLETED", "FAILED"):
            break
        time.sleep(0.1)

    assert job_data["status"] == "FAILED"
    assert "missing required header" in job_data["error_message"].lower()


def test_download_valid_records():
    csv_content = (
        "name,email,phone,company,city\n"
        "Good User,good@example.com,555-0101,Good Co,Boston\n"
        "Bad User,bad-email,123,Bad Co,Miami\n"
    )

    upload_res = client.post(
        "/api/imports",
        files={"file": ("mixed.csv", csv_content, "text/csv")}
    )
    job_id = upload_res.json()["job_id"]

    for _ in range(20):
        res = client.get(f"/api/imports/{job_id}")
        if res.json()["status"] in ("COMPLETED", "FAILED"):
            break
        time.sleep(0.1)

    dl_res = client.get(f"/api/imports/{job_id}/download")
    assert dl_res.status_code == 200
    assert "text/csv" in dl_res.headers["content-type"]
    download_text = dl_res.text
    assert "Good User" in download_text
    assert "Bad User" not in download_text
