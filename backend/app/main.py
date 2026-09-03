from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import imports

# Initialize database schema tables on launch
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CSV Customer Import & Validation API",
    description="High-performance backend for streaming CSV processing, validation, and persistence.",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(imports.router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "CSV Importer API"}
