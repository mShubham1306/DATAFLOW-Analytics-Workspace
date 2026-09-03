from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import imports
import os

# Initialize database schema tables on launch
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CSV Customer Import & Validation API",
    description="High-performance backend for streaming CSV processing, validation, and persistence.",
    version="1.0.0"
)

# ALLOWED_ORIGIN: comma-separated list of frontend origins.
# In production set via Render env var. Defaults to localhost for dev.
_raw_origins = os.getenv(
    "ALLOWED_ORIGIN",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(imports.router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "CSV Importer API"}

