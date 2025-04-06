from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class JobDescriptionBase(BaseModel):
    title: str
    description: str

class JobDescription(JobDescriptionBase):
    pass

class JobDescriptionInDB(JobDescriptionBase):
    id: int
    standardized_role: str
    required_skills: List[str]
    nice_to_have_skills: List[str]
    experience_level: str
    processed_description: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class CandidateBase(BaseModel):
    name: str
    email: str
    resume: str

class CandidateCreate(CandidateBase):
    pass

class Candidate(CandidateBase):
    id: int
    skills: Optional[List[str]] = None
    experience: Optional[int] = None
    match_scores: Optional[Dict] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class CandidateJobMatchBase(BaseModel):
    candidate_id: int
    job_id: int

class CandidateJobMatch(CandidateJobMatchBase):
    pass

class CandidateJobMatchInDB(CandidateJobMatchBase):
    id: int
    match_score: float
    skill_match_details: Dict[str, float]
    interview_questions: Dict[str, List[str]]
    created_at: datetime
    
    class Config:
        orm_mode = True

class InterviewBase(BaseModel):
    candidate_id: int
    job_id: int
    interview_date: datetime
    status: Optional[str] = "Scheduled"

class InterviewCreate(InterviewBase):
    pass

class Interview(InterviewBase):
    id: int
    questions: Optional[Dict] = None
    responses: Optional[List[Dict]] = None
    feedback: Optional[Dict] = None
    score: Optional[float] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class InterviewResponse(BaseModel):
    interview_id: int
    question_id: int
    response: str

class InterviewEvaluation(BaseModel):
    match_id: int
    technical_score: float
    behavioral_score: float
    overall_score: float
    feedback: str

class JobBase(BaseModel):
    title: str
    description: str

class JobCreate(JobBase):
    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class Job(JobBase):
    id: int
    standardized_role: Optional[str] = None
    required_skills: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        orm_mode = True

class CandidateBaseExtended(BaseModel):
    name: str
    email: str
    resume: str

class CandidateCreateExtended(CandidateBaseExtended):
    pass

class CandidateExtended(CandidateBaseExtended):
    id: int
    skills: Optional[List[str]] = None
    experience: Optional[int] = None
    match_scores: Optional[dict] = None

    class Config:
        orm_mode = True

class InterviewBaseExtended(BaseModel):
    candidate_id: int
    job_id: int
    interview_date: datetime
    status: Optional[str] = "Scheduled"

class InterviewCreateExtended(InterviewBaseExtended):
    pass

class InterviewExtended(InterviewBaseExtended):
    id: int
    questions: Optional[List[dict]] = None
    responses: Optional[List[dict]] = None
    feedback: Optional[dict] = None
    score: Optional[float] = None

    class Config:
        orm_mode = True

class InterviewResponseExtended(BaseModel):
    interview_id: int
    question_id: int
    response: str

class InterviewQuestionExtended(BaseModel):
    id: int
    question: str
    type: str  # technical or behavioral
    expected_answer: Optional[str] = None
