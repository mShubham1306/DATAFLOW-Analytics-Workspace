import pytest
from app.utils.validators import normalize_row, validate_row


def test_normalize_row():
    raw_row = {
        " Name ": " Jane Doe ",
        "EMAIL": " JANE@EXAMPLE.COM ",
        "Phone": " 123-456-7890 ",
        "Company": " Acme Corp ",
        "City": " New York "
    }
    normalized = normalize_row(raw_row)
    assert normalized["name"] == "Jane Doe"
    assert normalized["email"] == "jane@example.com"
    assert normalized["phone"] == "123-456-7890"
    assert normalized["company"] == "Acme Corp"
    assert normalized["city"] == "New York"


def test_valid_record():
    seen_emails = set()
    row = {
        "name": "Alice Smith",
        "email": "alice@example.com",
        "phone": "+1-555-0199",
        "company": "TechCorp",
        "city": "San Francisco"
    }
    is_valid, is_duplicate, reasons, data = validate_row(row, seen_emails)
    assert is_valid is True
    assert is_duplicate is False
    assert len(reasons) == 0
    assert "alice@example.com" in seen_emails


def test_missing_required_fields():
    seen_emails = set()
    row = {
        "name": "",
        "email": "",
        "phone": "",
        "company": "",
        "city": ""
    }
    is_valid, is_duplicate, reasons, data = validate_row(row, seen_emails)
    assert is_valid is False
    codes = [r["code"] for r in reasons]
    assert "MISSING_NAME" in codes
    assert "MISSING_EMAIL" in codes
    assert "MISSING_PHONE" in codes
    assert "MISSING_COMPANY" in codes
    assert "MISSING_CITY" in codes


def test_invalid_email_and_phone():
    seen_emails = set()
    row = {
        "name": "Bob",
        "email": "invalid-email-at-domain.com",
        "phone": "123",
        "company": "Widgets LLC",
        "city": "Boston"
    }
    is_valid, is_duplicate, reasons, data = validate_row(row, seen_emails)
    assert is_valid is False
    codes = [r["code"] for r in reasons]
    assert "INVALID_EMAIL" in codes
    assert "INVALID_PHONE" in codes


def test_duplicate_email_detection():
    seen_emails = set()
    row1 = {
        "name": "User One",
        "email": "dup@example.com",
        "phone": "555-0100",
        "company": "Co 1",
        "city": "Austin"
    }
    row2 = {
        "name": "User Two",
        "email": "dup@example.com",
        "phone": "555-0200",
        "company": "Co 2",
        "city": "Dallas"
    }

    v1, d1, r1, _ = validate_row(row1, seen_emails)
    assert v1 is True
    assert d1 is False

    v2, d2, r2, _ = validate_row(row2, seen_emails)
    assert v2 is False
    assert d2 is True
    assert r2[0]["code"] == "DUPLICATE_EMAIL"
