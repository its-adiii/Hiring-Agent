from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timedelta
import logging
import json
from database import SessionLocal, engine, Base
import models
from agents.screening_agent import AutoScreeningAgent
from schemas import JobCreate, Job, CandidateJobMatchBase, InterviewResponse, CandidateBase

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
screening_agent = AutoScreeningAgent()

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
    """Get dynamic dashboard data."""
    try:
        # Get total candidates
        total_candidates = db.query(models.Candidate).count()
        logger.info(f"Total candidates: {total_candidates}")
        
        # Get total active jobs
        active_jobs = db.query(models.Job).count()
        logger.info(f"Active jobs: {active_jobs}")
        
        # Get all matches and calculate successful matches
        matches = db.query(models.CandidateJobMatch).all()
        total_matches = len(matches)
        successful_matches = sum(1 for match in matches if match.match_score and match.match_score >= 0.7)
        
        logger.info(f"Total matches: {total_matches}")
        logger.info(f"Successful matches: {successful_matches}")
        
        # Calculate screening rate
        candidates_with_matches = len(set(match.candidate_id for match in matches))
        screening_rate = (candidates_with_matches / total_candidates * 100) if total_candidates > 0 else 0
        logger.info(f"Screening rate: {screening_rate}%")
        
        # Prepare response data
        response_data = {
            "stats": {
                "activeJobs": active_jobs,
                "candidates": total_candidates,
                "total_matches": total_matches,
                "successful_matches": successful_matches,
                "screening_rate": round(screening_rate, 1)
            }
        }
        
        logger.info(f"Dashboard response: {json.dumps(response_data)}")
        return response_data
        
    except Exception as e:
        logger.error(f"Error getting dashboard data: {str(e)}")
        logger.exception("Full traceback:")
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

@app.get("/debug/status")
async def get_debug_status(db: Session = Depends(get_db)):
    """Get debug information about the current database state."""
    try:
        jobs = db.query(models.Job).all()
        candidates = db.query(models.Candidate).all()
        matches = db.query(models.CandidateJobMatch).all()
        
        return {
            "jobs_count": len(jobs),
            "jobs": [{"id": j.id, "title": j.title, "skills": j.required_skills} for j in jobs],
            "candidates_count": len(candidates),
            "candidates": [{"id": c.id, "name": c.name, "skills": c.skills} for c in candidates],
            "matches_count": len(matches)
        }
    except Exception as e:
        logger.error(f"Error in debug status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/jobs")
async def create_job(job: JobCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Processing job: {job.title}")
        
        # Process job with AI agent
        processed_job = await screening_agent.process_full_description(job.title, job.description)
        logger.info(f"AI processed job: {processed_job}")
        
        # Create job record with proper JSON fields
        db_job = models.Job(
            title=job.title,
            description=job.description,
            standardized_role=processed_job.get("standardized_role", ""),
            required_skills=processed_job.get("required_skills", []),  # Ensure this is a list
            created_at=datetime.utcnow()
        )
        
        # Add and commit with error handling
        try:
            db.add(db_job)
            db.commit()
            db.refresh(db_job)
            logger.info(f"Job created successfully: {db_job.id}")
            return db_job
        except Exception as db_error:
            logger.error(f"Database error: {str(db_error)}")
            db.rollback()
            raise HTTPException(status_code=500, detail="Failed to save job to database")
        
    except Exception as e:
        logger.error(f"Error creating job: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs", response_model=List[Job])
async def get_jobs(db: Session = Depends(get_db)):
    try:
        jobs = db.query(models.Job).all()
        logger.info(f"Retrieved {len(jobs)} jobs")
        return jobs
    except Exception as e:
        logger.error(f"Error retrieving jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: int, db: Session = Depends(get_db)):
    """Delete a job by ID."""
    try:
        # Find the job
        job = db.query(models.Job).filter(models.Job.id == job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Delete any associated matches
        db.query(models.CandidateJobMatch).filter(models.CandidateJobMatch.job_id == job_id).delete()
        
        # Delete any associated interviews
        db.query(models.Interview).filter(models.Interview.job_id == job_id).delete()
        
        # Delete the job
        db.delete(job)
        db.commit()
        
        return {"message": "Job deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting job {job_id}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match_candidate_job")
async def match_candidate_job(match: CandidateJobMatchBase, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received match request: {match}")
        
        # Get candidate and job
        candidate = db.query(models.Candidate).filter(models.Candidate.id == match.candidate_id).first()
        job = db.query(models.Job).filter(models.Job.id == match.job_id).first()
        
        logger.info(f"Found candidate: {candidate}, job: {job}")
        
        if not candidate or not job:
            raise HTTPException(status_code=404, detail="Candidate or job not found")
        
        # Calculate match score and generate interview questions
        skill_match = set(candidate.skills or []).intersection(set(job.required_skills or []))
        match_score = len(skill_match) / len(job.required_skills) if job.required_skills else 0
        
        logger.info(f"Calculated match score: {match_score}, matched skills: {skill_match}")
        
        # Generate interview questions based on matched skills
        technical_questions = [
            f"Explain your experience with {skill}" for skill in skill_match
        ]
        
        behavioral_questions = [
            "Describe a challenging project you worked on and how you handled it",
            "How do you handle disagreements with team members?",
            "Tell me about a time you had to learn a new technology quickly"
        ]
        
        # Create match record
        db_match = models.CandidateJobMatch(
            candidate_id=match.candidate_id,
            job_id=match.job_id,
            match_score=match_score,
            skill_match_details={"matched_skills": list(skill_match)},
            interview_questions={
                "technical": technical_questions,
                "behavioral": behavioral_questions
            },
            created_at=datetime.utcnow()
        )
        
        db.add(db_match)
        db.commit()
        db.refresh(db_match)
        
        logger.info(f"Created match record: {db_match.id}")
        return db_match
        
    except Exception as e:
        logger.error(f"Error matching candidate with job: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/matches")
async def get_matches(db: Session = Depends(get_db)):
    try:
        matches = db.query(models.CandidateJobMatch).all()
        logger.info(f"Retrieved {len(matches)} matches")
        return [match.to_dict() for match in matches]
    except Exception as e:
        logger.error(f"Error retrieving matches: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/candidates")
async def create_candidate(candidate: CandidateBase, db: Session = Depends(get_db)):
    try:
        logger.info(f"Processing candidate: {candidate.name}")
        
        # Extract skills from resume using AI
        skills = ["React.js", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB"]  # Placeholder for AI extraction
        
        # Create candidate record
        db_candidate = models.Candidate(
            name=candidate.name,
            email=candidate.email,
            resume=candidate.resume,
            skills=skills,
            experience=5,  # Placeholder for AI extraction
            created_at=datetime.utcnow()
        )
        
        db.add(db_candidate)
        db.commit()
        db.refresh(db_candidate)
        
        logger.info(f"Candidate created successfully: {db_candidate.id}")
        return db_candidate
        
    except Exception as e:
        logger.error(f"Error creating candidate: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/candidates")
async def get_candidates(db: Session = Depends(get_db)):
    try:
        candidates = db.query(models.Candidate).all()
        logger.info(f"Retrieved {len(candidates)} candidates")
        return candidates
    except Exception as e:
        logger.error(f"Error retrieving candidates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/candidates/{candidate_id}")
async def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Delete a candidate by ID."""
    try:
        # Find the candidate
        candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        # Delete any associated matches
        db.query(models.CandidateJobMatch).filter(models.CandidateJobMatch.candidate_id == candidate_id).delete()
        
        # Delete any associated interviews
        db.query(models.Interview).filter(models.Interview.candidate_id == candidate_id).delete()
        
        # Delete the candidate
        db.delete(candidate)
        db.commit()
        
        return {"message": "Candidate deleted successfully"}
        
    except Exception as e:
        logger.error(f"Error deleting candidate {candidate_id}: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/interview_response")
async def process_interview_response(
    response: InterviewResponse,
    db: Session = Depends(get_db)
):
    try:
        # Get the interview
        interview = db.query(models.Interview).filter(models.Interview.id == response.interview_id).first()
        if not interview:
            raise HTTPException(status_code=404, detail="Interview not found")
        
        # Evaluate the response using AI
        feedback = {
            "score": 0.85,  # This should be calculated by the AI model
            "feedback": "Good answer! You demonstrated clear understanding of the concept."
        }
        
        # Update interview responses
        if not interview.responses:
            interview.responses = []
        
        interview.responses.append({
            "question_id": response.question_id,
            "response": response.response,
            "feedback": feedback
        })
        
        # Update overall score
        scores = [resp["feedback"]["score"] for resp in interview.responses]
        interview.score = sum(scores) / len(scores)
        
        if len(interview.responses) == len(interview.questions.get("technical", [])) + len(interview.questions.get("behavioral", [])):
            interview.status = "Interview Completed"
        
        db.commit()
        
        return feedback
        
    except Exception as e:
        logger.error(f"Error processing interview response: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auto_screen")
async def auto_screen_candidates(db: Session = Depends(get_db)):
    """Return static screening data for testing."""
    try:
        logger.info("Returning static screening data")
        
        # Static matches data
        static_matches = [
            {
                "id": 1,
                "job": {
                    "id": 1,
                    "title": "Senior Python Developer",
                    "description": "Looking for an experienced Python developer with FastAPI and React experience",
                    "required_skills": ["Python", "FastAPI", "React", "SQL"],
                    "experience_level": "Senior",
                    "created_at": "2025-04-06T10:00:00"
                },
                "candidate": {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com",
                    "resume": "Experienced full-stack developer with 5 years of Python and React experience",
                    "skills": ["Python", "FastAPI", "React", "JavaScript", "SQL"],
                    "experience": 5,
                    "created_at": "2025-04-06T10:00:00"
                },
                "match_score": 0.85,
                "skill_match_details": {
                    "score": 0.9,
                    "matched_skills": ["Python", "FastAPI", "React", "SQL"],
                    "missing_skills": []
                },
                "interview_questions": {
                    "technical": [
                        "Explain FastAPI's dependency injection system",
                        "How do you handle state management in React?",
                        "Describe your experience with Python async/await"
                    ],
                    "behavioral": [
                        "Tell me about a challenging project you worked on",
                        "How do you handle tight deadlines?",
                        "Describe your approach to learning new technologies"
                    ]
                },
                "created_at": "2025-04-06T10:00:00"
            },
            {
                "id": 2,
                "job": {
                    "id": 2,
                    "title": "Frontend Developer",
                    "description": "Looking for a React developer with UI/UX experience",
                    "required_skills": ["React", "JavaScript", "CSS", "TypeScript"],
                    "experience_level": "Mid Level",
                    "created_at": "2025-04-06T10:00:00"
                },
                "candidate": {
                    "id": 2,
                    "name": "Jane Smith",
                    "email": "jane@example.com",
                    "resume": "Frontend developer with strong React and UI/UX skills",
                    "skills": ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
                    "experience": 3,
                    "created_at": "2025-04-06T10:00:00"
                },
                "match_score": 0.92,
                "skill_match_details": {
                    "score": 1.0,
                    "matched_skills": ["React", "JavaScript", "CSS", "TypeScript"],
                    "missing_skills": []
                },
                "interview_questions": {
                    "technical": [
                        "Explain React hooks and their benefits",
                        "How do you optimize React component performance?",
                        "Describe your experience with TypeScript"
                    ],
                    "behavioral": [
                        "How do you collaborate with designers?",
                        "Tell me about a time you improved UI performance",
                        "How do you stay updated with frontend trends?"
                    ]
                },
                "created_at": "2025-04-06T10:00:00"
            }
        ]
        
        logger.info(f"Returning {len(static_matches)} static matches")
        return static_matches
        
    except Exception as e:
        logger.error(f"Error returning static screening data: {str(e)}")
        logger.exception("Full traceback:")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/debug/add_test_data")
async def add_test_data(db: Session = Depends(get_db)):
    """Add test job and candidate data."""
    try:
        # Add a test job
        test_job = models.Job(
            title="Senior Software Engineer",
            description="We are looking for an experienced software engineer with expertise in Python and React.",
            standardized_role="Software Engineer",
            required_skills=["Python", "React", "SQL", "Git"],
            created_at=datetime.utcnow()
        )
        db.add(test_job)
        
        # Add a test candidate
        test_candidate = models.Candidate(
            name="John Doe",
            email="john@example.com",
            resume="Experienced software engineer with 5 years of experience in Python, React, and SQL development.",
            skills=["Python", "React", "JavaScript", "SQL", "Git"],
            experience=5,
            created_at=datetime.utcnow()
        )
        db.add(test_candidate)
        
        db.commit()
        db.refresh(test_job)
        db.refresh(test_candidate)
        
        return {
            "job": test_job.to_dict(),
            "candidate": test_candidate.to_dict()
        }
        
    except Exception as e:
        logger.error(f"Error adding test data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
