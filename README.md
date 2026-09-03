<div align="center">
  <h1>&#9672; DATAFLOW</h1>
  <h3>Power BI-Style CSV Customer Import &amp; Validation Intelligence Platform</h3>
  <p>
    <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&amp;logo=fastapi&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&amp;logo=react&amp;logoColor=black" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&amp;logo=vite&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat-square&amp;logo=tailwindcss&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/SQLite-SQLAlchemy-003B57?style=flat-square&amp;logo=sqlite&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&amp;logo=python&amp;logoColor=white" />
    <img src="https://img.shields.io/badge/Tests-9%2F9%20Passing-16A34A?style=flat-square" />
  </p>
  <p><em>Upload messy CSVs &rarr; Validate every row with extensible rules &rarr; Explore data quality through interactive analytics</em></p>
  <p>
    <a href="https://dataflow-analytics-workspace.vercel.app/" target="_blank"><strong>🚀 Live Application (Vercel)</strong></a> &bull;
    <a href="https://dataflow-analytics-workspace.onrender.com/docs" target="_blank"><strong>⚡ Live Swagger API (Render)</strong></a>
  </p>
</div>

---

## 🌐 Live Deployments

- **Frontend Dashboard (Vercel)**: [https://dataflow-analytics-workspace.vercel.app/](https://dataflow-analytics-workspace.vercel.app/)
- **Backend API & Swagger Docs (Render)**: [https://dataflow-analytics-workspace.onrender.com/docs](https://dataflow-analytics-workspace.onrender.com/docs)
- **API Health Check**: [https://dataflow-analytics-workspace.onrender.com/api/health](https://dataflow-analytics-workspace.onrender.com/api/health)

---

## Overview

DATAFLOW is a full-stack data quality and customer import platform that transforms raw CSV uploads into actionable, Power BI-style analytical intelligence. Built as a one-stop workspace:

- **Ingest** customer CSV files via drag-and-drop or 1-click sample load
- **Validate** every row (email, phone, required fields, O(N) duplicate detection)
- **Analyze** quality across 8 KPI cards and 8 interactive charts
- **Explore** records at row level with a slide-over inspector drawer
- **Audit** previous imports with a persistent history log
- **Export** clean, validated records as a streaming CSV download

---

## Architecture

```
+--------------------------------------------------+
|             React 18 + Vite Frontend             |
|                                                  |
|  LandingPage -> ProcessingScreen                 |
|  Power BI Overview (KPIs + 8 Charts)             |
|  Data Explorer + Record Inspector Drawer         |
|  Import History + Global Cross-Dashboard Filters |
+--------------------------------------------------+
                       |  REST / JSON
+--------------------------------------------------+
|            FastAPI (Python 3.11)                 |
|                                                  |
|  POST /api/imports/upload                        |
|  GET  /api/imports/{id}/status                   |
|  GET  /api/imports/{id}/records                  |
|  GET  /api/imports/{id}/analytics                |
|  GET  /api/imports/{id}/download                 |
|  GET  /api/imports/history                       |
+--------------------------------------------------+
                       |  SQLAlchemy ORM
+--------------------------------------------------+
|              SQLite Database                     |
|                                                  |
|  import_jobs    (status, counters)               |
|  import_records (fields, validation_reasons)     |
|  Indexes: (job_id, is_valid), (job_id, email)    |
+--------------------------------------------------+
```

---

## Features

### Validation Pipeline

| Rule | Description |
|------|-------------|
| Required Fields | `name`, `email`, `phone`, `company`, `city` all checked for presence |
| Email Format | RFC 5322-compliant regex validation |
| Phone Format | E.164 / North American formats, minimum 7-digit check |
| Duplicate Detection | O(N) in-memory HashSet on normalized email addresses |
| Whitespace Normalization | Leading/trailing spaces stripped before validation |

### Power BI Analytics Dashboard

8 KPI cards and 8 interactive charts, all computed via server-side SQL aggregations:

| KPI Cards | Charts |
|-----------|--------|
| Total Records | Validation Status Donut |
| Valid Records (count + %) | Validation Issues Breakdown |
| Invalid Records (count + %) | Field Completeness Profile |
| Duplicate Records (count + %) | Top Entities by Company |
| Quality Score (A/B/C rating) | Records by Geography (City) |
| Field Completeness Average | Duplicate Analysis |
| Unique Companies | Quality Rate by Company (stacked) |
| Unique Cities | City Quality Leaderboard |

### Global Cross-Dashboard Filtering

Select **Company**, **City**, **Status**, or **Issue Type** and every KPI card, chart, and the data table update simultaneously.

### Persistent Import History

All ingestion runs persist in SQLite and remain accessible across browser reloads. Each entry shows quality score, record counts, and links for downloading or re-opening the workspace.

---

## Quickstart

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **npm 9+**

### 1. Clone the Repository

```bash
git clone https://github.com/mShubham1306/DATAFLOW-Analytics-Workspace.git
cd DATAFLOW-Analytics-Workspace
```

### 2. Run the Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

- Backend live at: **http://127.0.0.1:8000**
- Interactive API docs: **http://127.0.0.1:8000/docs**

### 3. Run the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- Frontend live at: **http://localhost:5173**

### 4. Try It Immediately

Open **http://localhost:5173** and click **"1-Click Load Sample Dataset"**. The system will:

1. Upload the embedded 30-record evaluation dataset
2. Show the live processing screen with a progress bar and step checklist
3. Transition to the full Power BI analytics workspace
4. Let you explore records, apply cross-dashboard filters, search, and download clean data

---

## Project Structure

```
DATAFLOW-Analytics-Workspace/
|-- backend/
|   |-- app/
|   |   |-- api/imports.py              # REST endpoints
|   |   |-- models/
|   |   |   |-- import_job.py           # Job model (status, counters)
|   |   |   +-- import_record.py        # Record model + validation reasons
|   |   |-- repositories/
|   |   |   +-- import_repository.py   # DB queries + SQL analytics aggregations
|   |   |-- services/
|   |   |   +-- import_service.py      # Streaming CSV processor
|   |   |-- utils/
|   |   |   |-- csv_parser.py          # Batch streaming CSV reader
|   |   |   +-- validators.py          # Validation rules engine
|   |   |-- database.py                # SQLAlchemy engine + session
|   |   +-- schemas/import_schema.py   # Pydantic response models
|   |-- tests/
|   |   |-- test_imports.py            # API integration tests (7 tests)
|   |   |-- test_validation.py         # Validator unit tests (2 tests)
|   |   +-- verify_e2e.py              # End-to-end verification script
|   +-- requirements.txt
|
|-- frontend/
|   +-- src/
|       |-- api/importsApi.js           # Axios API calls
|       |-- components/
|       |   |-- Sidebar.jsx             # Persistent BI navigation sidebar
|       |   |-- TopNavbar.jsx           # Dataset header + download button
|       |   |-- LandingPage.jsx         # Hero + drop zone + 1-click sample load
|       |   |-- ProcessingScreen.jsx    # Live progress bar + step checklist
|       |   |-- GlobalFilterBar.jsx     # Cross-dashboard filter dropdowns
|       |   |-- KpiCards.jsx            # 8 metric KPI cards
|       |   |-- AnalyticsCharts.jsx     # 8 SVG/Tailwind data visualizations
|       |   |-- DataExplorer.jsx        # Searchable, filterable records table
|       |   |-- RecordDetailDrawer.jsx  # Slide-over row inspector drawer
|       |   +-- ImportHistoryView.jsx   # Historical import audit log
|       +-- App.jsx                     # Layout, routing, state orchestration
|
|-- sample.csv                          # 30-record test dataset (intentional errors)
+-- README.md
```

---

## Running Tests

```bash
cd backend
venv\Scripts\activate   # Windows

pytest tests/ -v
```

Expected output:

```
tests/test_imports.py::test_health_check              PASSED
tests/test_imports.py::test_upload_valid_csv          PASSED
tests/test_imports.py::test_upload_invalid_file_type  PASSED
tests/test_imports.py::test_get_job_status            PASSED
tests/test_imports.py::test_get_records_pagination    PASSED
tests/test_imports.py::test_download_valid_records    PASSED
tests/test_imports.py::test_get_import_history        PASSED
tests/test_validation.py::test_email_validation       PASSED
tests/test_validation.py::test_phone_validation       PASSED

9 passed in 2.xx s
```

Run the end-to-end verification script:

```bash
python tests/verify_e2e.py
```

Executes the full pipeline: upload -> poll status -> records -> analytics -> download, and prints a quality report.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/imports/upload` | Upload CSV file, returns `job_id` |
| `GET` | `/api/imports/history` | List all historical import jobs |
| `GET` | `/api/imports/{job_id}/status` | Poll job status and counters |
| `GET` | `/api/imports/{job_id}/records` | Paginated records with search/filter |
| `GET` | `/api/imports/{job_id}/analytics` | SQL-aggregated analytics payload |
| `GET` | `/api/imports/{job_id}/download` | Streaming download of valid records as CSV |

### Records Query Parameters

```
GET /api/imports/{job_id}/records
  ?page=1
  &limit=50
  &search=john
  &status=invalid
  &company=Acme
  &city=Austin
  &error_type=invalid_email
```

### Analytics Query Parameters

```
GET /api/imports/{job_id}/analytics
  ?company=TechCorp
  &city=Mumbai
  &status=invalid
```

---

## Design System

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#F7F8FA` | App canvas |
| Surface | `#FFFFFF` | Cards, panels |
| Border | `#E5E7EB` | Dividers, outlines |
| Primary | `#2563EB` | Actions, active states |
| Primary Dark | `#1D4ED8` | Hover states |
| Success | `#16A34A` | Valid records, passing states |
| Warning | `#F59E0B` | Duplicates, caution states |
| Danger | `#DC2626` | Invalid records, errors |
| Text | `#111827` | Primary text |
| Muted | `#6B7280` | Secondary text, labels |

---

## Technical Highlights

- **Streaming CSV Parser**: Processes files in configurable batches — O(batch) RAM regardless of file size
- **O(N) Duplicate Detection**: In-memory HashSet on normalized email; no extra DB reads per record
- **SQL-Aggregated Analytics**: All chart and KPI data computed via a single parameterized SQL query, not in Python/React
- **Background Processing**: Upload returns immediately with `job_id`; client polls status at 1-second intervals
- **Composite DB Indexes**: `(job_id, is_valid)` and `(job_id, email)` for fast filtered queries
- **Cross-Dashboard Filters**: Filter state flows from `GlobalFilterBar -> getJobAnalytics -> getJobRecords`, keeping charts and table always in sync

---

## CSV Format

Your CSV must include these headers (case-insensitive, whitespace-tolerant):

```csv
name,email,phone,company,city
John Doe,john@acme.com,+1-555-234-5678,Acme Inc,New York
```

A 30-record sample with intentional validation failures is included at `sample.csv`.

---

## Deployment

### Backend on Render (Free tier)

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repository
3. Render will auto-detect `render.yaml` — or configure manually:

| Setting | Value |
|---------|-------|
| **Root directory** | `backend` |
| **Build command** | `pip install -r requirements.txt` |
| **Start command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Environment** | Python 3 |

4. Add environment variable in Render dashboard:

| Key | Value |
|-----|-------|
| `ALLOWED_ORIGIN` | `https://your-app.vercel.app` (set after Vercel deploy) |

5. After deploy, copy your Render service URL (e.g. `https://dataflow-api.onrender.com`)

> **Note**: Render's free tier uses an ephemeral filesystem — SQLite data resets on restart. For persistent storage, provision a **Render PostgreSQL** database and set `DATABASE_URL` to the Postgres connection string.

---

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://dataflow-api.onrender.com` (your Render URL, no trailing slash) |

4. Deploy. Vercel auto-detects Vite and uses `vercel.json` for SPA routing.
5. Copy your Vercel URL and paste it back into Render's `ALLOWED_ORIGIN` env var.

---



MIT License — free to use, adapt, and distribute.

---

<div align="center">
  Built with FastAPI &nbsp;|&nbsp; React 18 &nbsp;|&nbsp; Vite &nbsp;|&nbsp; Tailwind CSS &nbsp;|&nbsp; SQLAlchemy &nbsp;|&nbsp; SQLite
</div>
