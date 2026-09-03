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

# ALLOWED_ORIGIN: comma-separated list of frontend origins, or "*"
_raw_origins = os.getenv(
    "ALLOWED_ORIGIN",
    "https://dataflow-analytics-workspace.vercel.app,http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)

if "*" in _raw_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Normalize: strip spaces and trailing slashes so both "https://app.vercel.app/" and "https://app.vercel.app" match
    parsed = set()
    for o in _raw_origins.split(","):
        cleaned = o.strip().rstrip("/")
        if cleaned:
            parsed.add(cleaned)
            parsed.add(cleaned + "/")
    # Always include the project's production Vercel domain
    parsed.add("https://dataflow-analytics-workspace.vercel.app")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(parsed),
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(imports.router)


@app.get("/", tags=["Root"])
def root():
    return {
        "status": "online",
        "service": "DATAFLOW Analytics Backend API",
        "docs": "/docs",
        "health": "/api/health",
        "version": "1.0.0"
    }


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "CSV Importer API"}


