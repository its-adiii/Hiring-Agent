from .base_agent import BaseAgent
import logging

logger = logging.getLogger(__name__)

class CandidateScreeningAgent(BaseAgent):
    async def extract_skills(self, resume: str) -> str:
        prompt = f"""
        Task: Extract technical skills from this resume.
        Format: Return ONLY a comma-separated list of skills, no explanations.
        Resume: {resume}
        Skills:"""
        try:
            return await self.process(prompt)
        except Exception as e:
            logger.error(f"Error extracting candidate skills: {str(e)}")
            return ""

    async def evaluate_technical(self, resume: str, required_skills: list[str]) -> float:
        skills_str = ", ".join(required_skills)
        prompt = f"""
        Task: Evaluate technical expertise
        Required Skills: {skills_str}
        Resume: {resume}
        
        Rate from 0 to 10 based on:
        1. Skill match with requirements
        2. Depth of technical experience
        3. Technical projects/achievements
        
        Return ONLY the numerical score (0-10):"""
        try:
            result = await self.process(prompt)
            return float(result.strip()) / 10.0
        except Exception as e:
            logger.error(f"Error evaluating technical score: {str(e)}")
            return 0.0

    async def evaluate_behavioral(self, resume: str) -> float:
        prompt = f"""
        Task: Evaluate behavioral competencies from resume
        Resume: {resume}
        
        Rate from 0 to 10 based on:
        1. Leadership experience
        2. Team collaboration
        3. Communication skills
        4. Problem-solving examples
        
        Return ONLY the numerical score (0-10):"""
        try:
            result = await self.process(prompt)
            return float(result.strip()) / 10.0
        except Exception as e:
            logger.error(f"Error evaluating behavioral score: {str(e)}")
            return 0.0

    async def analyze_candidate(self, resume: str) -> dict:
        prompt = f"""
        Task: Provide a comprehensive candidate analysis
        Resume: {resume}
        
        Analyze:
        1. Experience Level (Entry/Mid/Senior)
        2. Key Strengths
        3. Areas for Development
        4. Overall Assessment
        
        Analysis:"""
        try:
            analysis = await self.process(prompt)
            
            # Extract experience level
            experience_level = "Entry Level"
            if "senior" in analysis.lower():
                experience_level = "Senior"
            elif "mid" in analysis.lower() or "intermediate" in analysis.lower():
                experience_level = "Mid Level"
            
            return {
                "experience_level": experience_level,
                "analysis": analysis
            }
        except Exception as e:
            logger.error(f"Error analyzing candidate: {str(e)}")
            return {
                "experience_level": "Entry Level",
                "analysis": "Error analyzing candidate profile"
            }
