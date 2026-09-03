from sqlalchemy import Column, Integer, String, Boolean, JSON, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class ImportRecord(Base):
    __tablename__ = "import_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String(36), ForeignKey("import_jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    row_number = Column(Integer, nullable=False)
    name = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(100), nullable=True)
    company = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    is_valid = Column(Boolean, nullable=False, default=True)
    is_duplicate = Column(Boolean, nullable=False, default=False)
    validation_reasons = Column(JSON, nullable=False, default=list)

    job = relationship("ImportJob", back_populates="records")

    __table_args__ = (
        Index("ix_records_job_is_valid", "job_id", "is_valid"),
        Index("ix_records_job_email", "job_id", "email"),
    )
