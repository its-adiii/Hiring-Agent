from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    standardized_role = Column(String)
    required_skills = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interviews = relationship("Interview", back_populates="job")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "standardized_role": self.standardized_role,
            "required_skills": self.required_skills,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Candidate(Base):
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    resume = Column(String, nullable=False)
    skills = Column(JSON)
    experience = Column(Integer)
    match_scores = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    interviews = relationship("Interview", back_populates="candidate")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "resume": self.resume,
            "skills": self.skills,
            "experience": self.experience,
            "match_scores": self.match_scores,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    interview_date = Column(DateTime)
    status = Column(String, default="Scheduled")
    questions = Column(JSON)
    responses = Column(JSON)
    feedback = Column(JSON)
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate", back_populates="interviews")
    job = relationship("Job", back_populates="interviews")

    def to_dict(self):
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "job_id": self.job_id,
            "interview_date": self.interview_date.isoformat() if self.interview_date else None,
            "status": self.status,
            "questions": self.questions,
            "responses": self.responses,
            "feedback": self.feedback,
            "score": self.score,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "candidate": self.candidate.to_dict() if self.candidate else None,
            "job": self.job.to_dict() if self.job else None
        }

class CandidateJobMatch(Base):
    __tablename__ = "candidate_job_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    match_score = Column(Float)
    skill_match_details = Column(JSON)
    interview_questions = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    candidate = relationship("Candidate")
    job = relationship("Job")

    def to_dict(self):
        return {
            "id": self.id,
            "candidate_id": self.candidate_id,
            "job_id": self.job_id,
            "match_score": self.match_score,
            "skill_match_details": self.skill_match_details,
            "interview_questions": self.interview_questions,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "candidate": self.candidate.to_dict() if self.candidate else None,
            "job": self.job.to_dict() if self.job else None
        }
