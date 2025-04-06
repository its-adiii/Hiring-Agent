from .base_agent import BaseAgent
import logging
from typing import List, Dict, Any
import asyncio

logger = logging.getLogger(__name__)

class AutoScreeningAgent(BaseAgent):
    def __init__(self):
        super().__init__()
        logger.info("AutoScreeningAgent initialized")

    async def screen_all_candidates(self, jobs: List[Dict], candidates: List[Dict]) -> List[Dict]:
        """Screen all candidates against all jobs automatically."""
        logger.info(f"Starting auto screening for {len(candidates)} candidates and {len(jobs)} jobs")
        
        matches = []
        for job in jobs:
            logger.info(f"Processing job: {job['title']}")
            for candidate in candidates:
                logger.info(f"Processing candidate: {candidate['name']}")
                try:
                    match = await self.evaluate_match(job, candidate)
                    logger.info(f"Match score: {match['match_score']}")
                    if match["match_score"] >= 0.5:  # Lowered threshold to 50%
                        match["job"] = job
                        match["candidate"] = candidate
                        matches.append(match)
                        logger.info(f"Found match: Candidate {candidate['name']} - Job {job['title']} - Score {match['match_score']}")
                except Exception as e:
                    logger.error(f"Error matching candidate {candidate.get('name')} with job {job.get('title')}: {str(e)}")
                    logger.exception("Full traceback:")
        
        # Sort matches by score in descending order
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        logger.info(f"Auto screening completed. Found {len(matches)} matches")
        return matches

    async def evaluate_match(self, job: Dict, candidate: Dict) -> Dict:
        """Evaluate a single candidate against a job."""
        logger.info(f"Evaluating match between candidate {candidate['name']} and job {job['title']}")
        
        # Calculate skill match
        skill_match = await self._calculate_skill_match(
            job.get("required_skills", []), 
            candidate.get("skills", [])
        )
        
        # Calculate experience match
        exp_match = await self._calculate_experience_match(
            job.get("experience_level", "Entry Level"),
            candidate.get("experience", 0)
        )
        
        # Generate interview questions for matched skills
        questions = await self._generate_interview_questions(
            matched_skills=skill_match["matched_skills"],
            job_role=job.get("title", "")
        )
        
        # Weight skill match more heavily for entry-level positions
        if job.get("experience_level") == "Entry Level":
            match_score = (skill_match["score"] * 0.8) + (exp_match * 0.2)
        else:
            match_score = (skill_match["score"] * 0.6) + (exp_match * 0.4)
        
        return {
            "job_id": job["id"],
            "candidate_id": candidate["id"],
            "match_score": match_score,
            "skill_match_details": skill_match,
            "experience_match": exp_match,
            "interview_questions": questions
        }

    async def _calculate_skill_match(self, required_skills: List[str], candidate_skills: List[str]) -> Dict:
        """Calculate the skill match score and identify matching skills."""
        logger.info(f"Calculating skill match. Required: {required_skills}, Candidate: {candidate_skills}")
        
        if not required_skills or not candidate_skills:
            return {"score": 0, "matched_skills": [], "missing_skills": required_skills or []}

        matched_skills = []
        for req_skill in required_skills:
            prompt = f"""
            Check if the required skill matches any of these candidate skills.
            Required: {req_skill}
            Candidate skills: {', '.join(candidate_skills)}
            Consider similar technologies. Answer yes or no."""
            
            try:
                response = await self.process(prompt)
                if "yes" in response.lower():
                    matched_skills.append(req_skill)
            except Exception as e:
                logger.error(f"Error processing skill match for {req_skill}: {str(e)}")
        
        score = len(matched_skills) / len(required_skills) if required_skills else 0
        missing_skills = [s for s in required_skills if s not in matched_skills]
        
        logger.info(f"Skill match results - Score: {score}, Matched: {matched_skills}, Missing: {missing_skills}")
        return {
            "score": score,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills
        }

    async def _calculate_experience_match(self, required_level: str, candidate_experience: int) -> float:
        """Calculate the experience match score."""
        level_mapping = {
            "Entry Level": 0,
            "Junior": 1,
            "Mid Level": 3,
            "Senior": 5,
            "Lead": 7,
            "Principal": 10
        }
        
        required_years = level_mapping.get(required_level, 0)
        if required_years == 0:
            return 1.0  # Perfect match for entry level
        
        # More nuanced scoring
        if candidate_experience >= required_years:
            return 1.0  # Perfect match if candidate meets or exceeds requirements
        elif candidate_experience >= required_years * 0.7:
            return 0.8  # Good match if candidate has at least 70% of required experience
        elif candidate_experience >= required_years * 0.5:
            return 0.6  # Moderate match if candidate has at least 50% of required experience
        else:
            return max(0.3, candidate_experience / required_years)  # Minimum score of 0.3

    async def _generate_interview_questions(self, matched_skills: List[str], job_role: str) -> Dict[str, List[str]]:
        """Generate technical and behavioral interview questions."""
        logger.info(f"Generating interview questions for {job_role} with skills: {matched_skills}")
        
        technical_questions = []
        for skill in matched_skills[:3]:  # Limit to top 3 skills
            prompt = f"""
            Generate a technical interview question for {skill} role.
            Question should be specific and test practical knowledge.
            Return only the question."""
            
            try:
                question = await self.process(prompt)
                if question and len(question) > 10:  # Basic validation
                    technical_questions.append(question.strip())
            except Exception as e:
                logger.error(f"Error generating technical question for {skill}: {str(e)}")

        # Generate behavioral questions
        prompt = f"""
        List 3 behavioral interview questions for {job_role}.
        Questions should be about problem-solving and teamwork.
        Separate questions with newlines."""
        
        behavioral_questions = []
        try:
            response = await self.process(prompt)
            questions = [q.strip() for q in response.split('\n') if q.strip()]
            behavioral_questions = questions[:3]  # Take up to 3 questions
        except Exception as e:
            logger.error(f"Error generating behavioral questions: {str(e)}")

        return {
            "technical": technical_questions,
            "behavioral": behavioral_questions
        }

    async def process_full_description(self, title: str, description: str) -> Dict:
        """Process a job description to extract standardized role and required skills."""
        try:
            # Extract skills from description
            prompt = f"""
            Extract required skills from this job description.
            Title: {title}
            Description: {description}
            List only the technical skills, one per line."""
            
            skills_response = await self.process(prompt)
            skills = [s.strip() for s in skills_response.split('\n') if s.strip()]
            
            # Determine experience level
            prompt = f"""
            Determine the experience level required for this job.
            Title: {title}
            Description: {description}
            Answer with ONLY ONE of: Entry Level, Junior, Mid Level, Senior, Lead, Principal"""
            
            experience_level = await self.process(prompt)
            experience_level = experience_level.strip()
            
            return {
                "title": title,
                "description": description,
                "required_skills": skills,
                "experience_level": experience_level
            }
            
        except Exception as e:
            logger.error(f"Error processing job description: {str(e)}")
            raise
