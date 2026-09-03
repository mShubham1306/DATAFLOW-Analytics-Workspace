# 🚀 CSV Customer Import & Validation Dashboard (OnePrism Solution)

A production-grade, highly performant, and scalable full-stack web application designed for importing, validating, persisting, filtering, and exporting customer records from CSV files.

Built with a **FastAPI Python backend** (SQLAlchemy, Pydantic, SQLite/PostgreSQL) and a **React 18 frontend** (Vite, Tailwind CSS, Lucide icons, Axios).

---

## 🏗️ Architecture Diagram

```text
                               ┌────────────────────────────────┐
                               │           React UI             │
                               │                                │
                               │ • Drag & Drop Upload Zone      │
                               │ • Live Job Polling Hook        │
                               │ • Summary Metrics Cards        │
                               │ • DB Search/Filter/Pagination  │
                               │ • Import History Dashboard     │
                               │ • Streaming CSV Download       │
                               └───────────────┬────────────────┘
                                               │ REST API (JSON / Multipart)
                                               ▼
                               ┌────────────────────────────────┐
                               │         FastAPI Server         │
                               │                                │
                               │ • POST /api/imports            │
                               │ • GET  /api/imports            │
                               │ • GET  /api/imports/{id}       │
                               │ • GET  /api/imports/{id}/record│
                               │ • GET  /api/imports/{id}/downld│
                               │ • DEL  /api/imports/{id}       │
                               └───────────────┬────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
     ┌──────────────────┐            ┌──────────────────┐            ┌──────────────────┐
     │   CSV Parser     │            │ Validation       │            │ Job Background   │
     │   (Streaming)    │───────────►│ Engine           │───────────►│ Processor        │
     │   O(batch) RAM   │            │ Extensible Rules │            │ (FastAPI Tasks)  │
     └──────────────────┘            └──────────────────┘            └─────────┬────────┘
                                                                               │
                                                                               ▼
                                                                     ┌──────────────────┐
                                                                     │     Database     │
                                                                     │ (Indexed SQLite) │
                                                                     │                  │
                                                                     │ • import_jobs    │
                                                                     │ • import_records │
                                                                     └──────────────────┘
```

---

## 🧮 Data Structures & Algorithms (DSA Metrics)

| Feature / Problem | Algorithm & Data Structure | Time Complexity | Space Complexity |
| :--- | :--- | :---: | :---: |
| **CSV Row Processing** | Streaming batch generator | $O(N)$ | $O(\text{batch\_size})$ memory |
| **Duplicate Detection** | `HashSet(email)` lookup | $O(1)$ avg per row | $O(N)$ |
| **Record Validation** | Single-pass pipeline | $O(N)$ | $O(1)$ per row |
| **Records Pagination** | DB Indexed `LIMIT`/`OFFSET` | $O(\log K + \text{limit})$ | $O(\text{limit})$ |
| **Search Filter** | Indexed SQL `ILIKE` pattern match | DB Index dependent | $O(\text{limit})$ |
| **Valid CSV Download** | Chunked `StreamingResponse` | $O(V)$ | $O(1)$ memory buffer |

*Where $N$ = total records in CSV file, $V$ = valid records, $K$ = total records in database for job.*

---

## 🗄️ Database Schema & Indexes

### Table 1: `import_jobs`
- `id` (String UUID, Primary Key)
- `filename` (String)
- `status` (Enum: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, Indexed)
- `total_records` (Integer)
- `valid_records` (Integer)
- `invalid_records` (Integer)
- `duplicate_count` (Integer)
- `error_message` (Text NULL)
- `created_at` (DateTime, Indexed)
- `completed_at` (DateTime NULL)

### Table 2: `import_records`
- `id` (Integer, Primary Key)
- `job_id` (String FK $\rightarrow$ `import_jobs.id`, Indexed)
- `row_number` (Integer)
- `name` (String NULL)
- `email` (String NULL)
- `phone` (String NULL)
- `company` (String NULL)
- `city` (String NULL)
- `is_valid` (Boolean)
- `is_duplicate` (Boolean)
- `validation_reasons` (JSON list of structured objects: `[{"field": "...", "code": "...", "message": "..."}]`)

### Database Indexes
- `import_records.job_id`
- Composite Index `(import_records.job_id, import_records.is_valid)`
- Composite Index `(import_records.job_id, import_records.email)`
- `import_jobs.created_at`

---

## 🔍 Validation Pipeline Rules

Each record is passed through an extensible pipeline:
1. **Normalization**: Trims whitespace from all fields and converts email addresses to lowercase.
2. **Required Fields**: Ensures `name`, `email`, `phone`, `company`, and `city` are present.
3. **Format Validation**:
   - **Email**: Verified using standard RFC 5322 compatible regex.
   - **Phone**: Verified for valid phone number format ($\ge 7$ digits, allowing `+`, `-`, spaces, parentheses).
4. **Duplicate Email Detection**: Uses an in-memory `HashSet` tracking normalized emails seen within the import job.
5. **Structured Error Output**: Records failing any rule get marked `is_valid = false` with structured JSON error tags listing all applicable validation reasons.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/imports` | Upload CSV file; returns `job_id` immediately |
| `GET` | `/api/imports` | List previous import jobs (persistent history) |
| `GET` | `/api/imports/{job_id}` | Get status and metric summary for an import job |
| `GET` | `/api/imports/{job_id}/records` | Paginated records list (supports `search`, `status=all/valid/invalid`, `page`, `limit`) |
| `GET` | `/api/imports/{job_id}/download` | Stream valid records as downloadable `.csv` file |
| `DELETE` | `/api/imports/{job_id}` | Delete import job and all associated records |

---

## 🛠️ Getting Started & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`

---

### 1. Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run backend test suite
python -m pytest -v

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

FastAPI interactive documentation will be live at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

```powershell
# Open a new terminal and navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The React Dashboard will be available at `http://localhost:5173`.

---

### 3. Testing with Sample Data

A comprehensive sample CSV dataset is included in the project root: `sample.csv`.
- Drag and drop `sample.csv` onto the dashboard upload zone.
- Observe live status polling (`PENDING` $\rightarrow$ `PROCESSING` $\rightarrow$ `COMPLETED`).
- View total, valid, invalid, and duplicate count breakdowns.
- Test searching for records, filtering by `Invalid Only`, and clicking **Download Valid CSV**.
