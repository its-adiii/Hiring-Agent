from .base_agent import BaseAgent
import logging

logger = logging.getLogger(__name__)

class JDProcessingAgent(BaseAgent):
    async def extract_skills(self, description: str) -> str:
        prompt = f"""
        Task: Extract technical skills from the job description.
        Format: Return as comma-separated list
        Job Description: {description}
        Skills:"""
        try:
            return await self.process(prompt)
        except Exception as e:
            logger.error(f"Error extracting skills: {str(e)}")
            return ""

    async def standardize_role(self, title: str) -> str:
        prompt = f"""
        Task: Standardize this job title to a common format
        Examples:
        - "Sr. Software Dev" -> "Senior Software Engineer"
        - "Jr Python Developer" -> "Junior Software Engineer"
        - "Full Stack Dev" -> "Full Stack Engineer"
        
        Job Title: {title}
        Standardized Title:"""
        try:
            return await self.process(prompt)
        except Exception as e:
            logger.error(f"Error standardizing role: {str(e)}")
            return title

    async def analyze_requirements(self, description: str) -> str:
        prompt = f"""
        Task: Analyze the job description and provide:
        1. Required Skills (must-have)
        2. Nice-to-have Skills
        3. Experience Level (Entry/Mid/Senior)
        4. Key Responsibilities
        
        Job Description: {description}
        
        Analysis:"""
        try:
            return await self.process(prompt)
        except Exception as e:
            logger.error(f"Error analyzing requirements: {str(e)}")
            return ""

    async def process_full_description(self, title: str, description: str) -> dict:
        try:
            # Get standardized role
            standard_role = await self.standardize_role(title)
            
            # Extract skills
            skills = await self.extract_skills(description)
            
            # Get detailed analysis
            analysis = await self.analyze_requirements(description)
            
            # Process the analysis to extract structured data
            analysis_lines = analysis.split('\n')
            required_skills = []
            nice_to_have = []
            experience_level = "Entry Level"
            responsibilities = []
            
            current_section = ""
            for line in analysis_lines:
                line = line.strip()
                if "Required Skills" in line:
                    current_section = "required"
                elif "Nice-to-have" in line:
                    current_section = "nice"
                elif "Experience Level" in line:
                    current_section = "experience"
                    if "senior" in line.lower():
                        experience_level = "Senior"
                    elif "mid" in line.lower():
                        experience_level = "Mid Level"
                elif "Responsibilities" in line:
                    current_section = "responsibilities"
                elif line and not line.endswith(':'):
                    if current_section == "required":
                        required_skills.extend([s.strip() for s in line.split(',')])
                    elif current_section == "nice":
                        nice_to_have.extend([s.strip() for s in line.split(',')])
                    elif current_section == "responsibilities":
                        responsibilities.append(line)
            
            return {
                "standardized_role": standard_role,
                "required_skills": required_skills,
                "nice_to_have_skills": nice_to_have,
                "experience_level": experience_level,
                "responsibilities": responsibilities,
                "full_analysis": analysis
            }
            
        except Exception as e:
            logger.error(f"Error in full processing: {str(e)}")
            return {
                "standardized_role": title,
                "required_skills": [],
                "nice_to_have_skills": [],
                "experience_level": "Entry Level",
                "responsibilities": [],
                "full_analysis": "Error processing description"
            }
