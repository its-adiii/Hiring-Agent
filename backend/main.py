from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta
import logging
import json
from database import SessionLocal, engine, Base
import models
from agents import JDProcessingAgent, CandidateAgent, InterviewAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Recruitment System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
jd_agent = JDProcessingAgent()
candidate_agent = CandidateAgent()
interview_agent = InterviewAgent()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create sample data
def create_sample_data(db: Session):
    try:
        # Check if we already have data
        if db.query(models.Job).count() > 0:
            logger.info("Sample data already exists")
            return

        # Create sample jobs
        jobs = [
            models.Job(
                title="Senior Python Developer",
                description="Looking for a senior Python developer with FastAPI experience",
                standardized_role="Software Engineer",
                required_skills=["Python", "FastAPI", "SQL"],
            ),
            models.Job(
                title="Frontend Developer",
                description="React developer needed for a web application",
                standardized_role="Frontend Developer",
                required_skills=["React", "JavaScript", "CSS"],
            )
        ]
        db.add_all(jobs)
        db.commit()
        logger.info("Created sample jobs")

        # Create sample candidates
        candidates = [
            models.Candidate(
                name="John Doe",
                email="john@example.com",
                resume="Experienced Python developer",
                skills=["Python", "FastAPI", "SQL"],
                experience=5,
                match_scores={"1": 0.85}
            ),
            models.Candidate(
                name="Jane Smith",
                email="jane@example.com",
                resume="Frontend expert with React experience",
                skills=["React", "JavaScript", "CSS"],
                experience=3,
                match_scores={"2": 0.9}
            )
        ]
        db.add_all(candidates)
        db.commit()
        logger.info("Created sample candidates")

        # Create sample interviews
        interviews = [
            models.Interview(
                candidate_id=1,
                job_id=1,
                interview_date=datetime.utcnow() + timedelta(days=1),
                status="Scheduled",
                questions={"technical": ["What is FastAPI?"]},
            ),
            models.Interview(
                candidate_id=2,
                job_id=2,
                interview_date=datetime.utcnow() - timedelta(days=1),
                status="Completed",
                questions={"technical": ["Explain React hooks"]},
                responses={"answers": ["Hooks are functions that..."]},
                feedback={"overall": "Good understanding"},
                score=0.85,
            )
        ]
        db.add_all(interviews)
        db.commit()
        logger.info("Created sample interviews")

    except Exception as e:
        logger.error(f"Error creating sample data: {str(e)}")
        db.rollback()
        raise

@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        create_sample_data(db)
    finally:
        db.close()

@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Recruitment System API"}

@app.get("/dashboard")
async def get_dashboard_data(db: Session = Depends(get_db)):
    try:
        logger.info("Fetching dashboard data")
        
        # Get data from database
        jobs = db.query(models.Job).all()
        candidates = db.query(models.Candidate).all()
        interviews = db.query(models.Interview).all()
        
        # Calculate stats
        completed_interviews = [i for i in interviews if i.status == "Completed"]
        successful_interviews = [i for i in completed_interviews if i.score and i.score >= 0.7]
        
        stats = {
            "activeJobs": len(jobs),
            "candidates": len(candidates),
            "interviews": len(completed_interviews),
            "placements": len([i for i in interviews if i.status == "Placed"])
        }
        
        # Calculate metrics
        metrics = {
            "interviewSuccessRate": round((len(successful_interviews) / len(completed_interviews) * 100) if completed_interviews else 0, 2),
            "responseRate": round((len(interviews) / len(candidates) * 100) if candidates else 0, 2),
            "timeToHire": "12 days"
        }
        
        # Get recent activity
        all_items = []
        
        # Add jobs to activity
        for job in jobs[-5:]:
            all_items.append({
                "id": f"job_{job.id}",
                "type": "job",
                "description": f"New job posted: {job.title}",
                "timestamp": job.created_at.isoformat() if job.created_at else datetime.utcnow().isoformat()
            })
        
        # Add candidates to activity
        for candidate in candidates[-5:]:
            all_items.append({
                "id": f"candidate_{candidate.id}",
                "type": "candidate",
                "description": f"New candidate registered: {candidate.name}",
                "timestamp": candidate.created_at.isoformat() if candidate.created_at else datetime.utcnow().isoformat()
            })
        
        # Add interviews to activity
        for interview in interviews[-5:]:
            description = f"Interview {interview.status.lower()}"
            if interview.score is not None:
                description += f": Score {interview.score * 100:.0f}%"
            
            all_items.append({
                "id": f"interview_{interview.id}",
                "type": "interview",
                "description": description,
                "timestamp": interview.created_at.isoformat() if interview.created_at else datetime.utcnow().isoformat()
            })
        
        # Sort by timestamp and get most recent 5
        recent_activity = sorted(all_items, key=lambda x: x["timestamp"], reverse=True)[:5]
        
        response_data = {
            "stats": stats,
            "metrics": metrics,
            "recentActivity": recent_activity
        }
        
        logger.info(f"Dashboard data prepared: {json.dumps(response_data)}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/debug/data")
async def get_debug_data(db: Session = Depends(get_db)):
    """Endpoint for debugging database contents"""
    try:
        jobs = db.query(models.Job).all()
        candidates = db.query(models.Candidate).all()
        interviews = db.query(models.Interview).all()
        
        return {
            "jobs": [job.to_dict() for job in jobs],
            "candidates": [candidate.to_dict() for candidate in candidates],
            "interviews": [interview.to_dict() for interview in interviews]
        }
    except Exception as e:
        logger.error(f"Error fetching debug data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
