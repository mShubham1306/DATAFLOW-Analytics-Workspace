import re
from typing import Dict, List, Tuple, Set, Any

# Standard RFC 5322 compatible email regex pattern
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

# Phone regex: must contain at least 7 digits, allowing +, -, spaces, and parentheses
PHONE_REGEX = re.compile(r"^\+?[\d\s\-\(\)]{7,20}$")


def normalize_row(row: Dict[str, Any]) -> Dict[str, str]:
    """
    Normalizes input row by stripping whitespace and lowercasing email.
    """
    normalized = {}
    for key, val in row.items():
        clean_key = str(key).strip().lower() if key else ""
        if val is None:
            clean_val = ""
        else:
            clean_val = str(val).strip()
        
        if clean_key == "email":
            clean_val = clean_val.lower()
            
        normalized[clean_key] = clean_val
    return normalized


def validate_row(row: Dict[str, str], seen_emails: Set[str]) -> Tuple[bool, bool, List[Dict[str, str]], Dict[str, str]]:
    """
    Executes extensible validation pipeline on a normalized CSV row.
    Returns (is_valid, is_duplicate, reasons, cleaned_data)
    """
    reasons: List[Dict[str, str]] = []
    is_duplicate = False

    name = row.get("name", "")
    email = row.get("email", "")
    phone = row.get("phone", "")
    company = row.get("company", "")
    city = row.get("city", "")

    cleaned_data = {
        "name": name,
        "email": email,
        "phone": phone,
        "company": company,
        "city": city
    }

    # 1. Required Fields Check
    if not name:
        reasons.append({
            "field": "name",
            "code": "MISSING_NAME",
            "message": "Name is required"
        })
    
    if not email:
        reasons.append({
            "field": "email",
            "code": "MISSING_EMAIL",
            "message": "Email is required"
        })
        
    if not phone:
        reasons.append({
            "field": "phone",
            "code": "MISSING_PHONE",
            "message": "Phone number is required"
        })

    if not company:
        reasons.append({
            "field": "company",
            "code": "MISSING_COMPANY",
            "message": "Company is required"
        })

    if not city:
        reasons.append({
            "field": "city",
            "code": "MISSING_CITY",
            "message": "City is required"
        })

    # 2. Format Validation
    if email:
        if not EMAIL_REGEX.match(email):
            reasons.append({
                "field": "email",
                "code": "INVALID_EMAIL",
                "message": f"'{email}' is not a valid email address"
            })

    if phone:
        # Check digit count
        digits_only = re.sub(r"\D", "", phone)
        if not PHONE_REGEX.match(phone) or len(digits_only) < 7:
            reasons.append({
                "field": "phone",
                "code": "INVALID_PHONE",
                "message": f"'{phone}' is not a valid phone number"
            })

    # 3. Duplicate Detection (O(1) Hash Set lookup)
    if email and EMAIL_REGEX.match(email):
        if email in seen_emails:
            is_duplicate = True
            reasons.append({
                "field": "email",
                "code": "DUPLICATE_EMAIL",
                "message": f"Duplicate email address '{email}' found in CSV"
            })
        else:
            seen_emails.add(email)

    is_valid = len(reasons) == 0

    return is_valid, is_duplicate, reasons, cleaned_data
