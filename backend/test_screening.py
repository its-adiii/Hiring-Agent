import requests
import json
import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000"

def create_jobs():
    jobs = [
        {
            "title": "Senior Full Stack Developer",
            "description": """Looking for a senior full stack developer with 5+ years of experience.
            Required skills:
            - React.js and Node.js expertise
            - Python and Django/FastAPI
            - Database design (PostgreSQL, MongoDB)
            - AWS cloud services
            - CI/CD and DevOps practices""",
            "required_skills": ["React.js", "Node.js", "Python", "Django", "FastAPI", "PostgreSQL", "MongoDB", "AWS", "CI/CD"],
            "experience_level": "Senior"
        },
        {
            "title": "Machine Learning Engineer",
            "description": """Seeking an ML engineer with strong Python and deep learning experience.
            Required skills:
            - PyTorch or TensorFlow
            - Python and data science libraries
            - MLOps and model deployment
            - Computer Vision or NLP
            - Big Data processing""",
            "required_skills": ["Python", "PyTorch", "TensorFlow", "MLOps", "Computer Vision", "NLP", "Big Data"],
            "experience_level": "Mid Level"
        },
        {
            "title": "DevOps Engineer",
            "description": """DevOps engineer needed for cloud infrastructure management.
            Required skills:
            - AWS/Azure/GCP expertise
            - Kubernetes and Docker
            - Terraform and Infrastructure as Code
            - Shell scripting
            - Monitoring and logging""",
            "required_skills": ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "Shell Scripting"],
            "experience_level": "Mid Level"
        },
        {
            "title": "Frontend Developer",
            "description": """Frontend developer with modern web technologies expertise.
            Required skills:
            - React.js/Vue.js/Angular
            - TypeScript and JavaScript
            - HTML5 and CSS3
            - UI/UX principles
            - Web performance optimization""",
            "required_skills": ["React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Web Performance"],
            "experience_level": "Mid Level"
        },
        {
            "title": "Backend Developer",
            "description": """Backend developer with microservices experience.
            Required skills:
            - Java/Python/Node.js
            - RESTful API design
            - Database optimization
            - Message queues
            - Microservices architecture""",
            "required_skills": ["Java", "Python", "Node.js", "RESTful API", "SQL", "Microservices"],
            "experience_level": "Mid Level"
        },
        {
            "title": "Data Engineer",
            "description": """Data engineer for big data pipeline development.
            Required skills:
            - Apache Spark
            - Python/Scala
            - Data warehousing
            - ETL pipeline design
            - SQL and NoSQL databases""",
            "required_skills": ["Apache Spark", "Python", "Scala", "Data Warehousing", "ETL", "SQL", "NoSQL"],
            "experience_level": "Mid Level"
        },
        {
            "title": "Mobile App Developer",
            "description": """Mobile developer for cross-platform app development.
            Required skills:
            - React Native/Flutter
            - iOS/Android development
            - API integration
            - Mobile UI design
            - App performance optimization""",
            "required_skills": ["React Native", "Flutter", "iOS", "Android", "Mobile UI", "API Integration"],
            "experience_level": "Mid Level"
        },
        {
            "title": "Cloud Solutions Architect",
            "description": """Cloud architect for enterprise solutions.
            Required skills:
            - Multi-cloud architecture
            - Security best practices
            - Cost optimization
            - System design
            - Enterprise integration""",
            "required_skills": ["AWS", "Azure", "GCP", "Cloud Security", "System Design", "Enterprise Architecture"],
            "experience_level": "Senior"
        },
        {
            "title": "AI Research Engineer",
            "description": """AI researcher for cutting-edge ML projects.
            Required skills:
            - Deep learning research
            - PyTorch/TensorFlow
            - Paper implementation
            - Experimentation
            - Research publication""",
            "required_skills": ["Deep Learning", "PyTorch", "TensorFlow", "Machine Learning", "Research"],
            "experience_level": "Senior"
        },
        {
            "title": "Security Engineer",
            "description": """Security engineer for application and infrastructure security.
            Required skills:
            - Application security
            - Penetration testing
            - Security auditing
            - Threat modeling
            - Security automation""",
            "required_skills": ["Application Security", "Penetration Testing", "Security Auditing", "Threat Modeling"],
            "experience_level": "Senior"
        }
    ]
    
    created_jobs = []
    for job in jobs:
        try:
            response = requests.post(f"{BASE_URL}/jobs", json=job)
            if response.status_code == 200:
                created_jobs.append(response.json())
                logger.info(f"Created job: {job['title']}")
            else:
                logger.error(f"Failed to create job {job['title']}: {response.text}")
        except Exception as e:
            logger.error(f"Error creating job {job['title']}: {str(e)}")
    return created_jobs

def create_candidates():
    candidates = [
        {
            "name": "Alex Johnson",
            "email": "alex.johnson@email.com",
            "resume": """Senior Full Stack Developer with 7 years of experience.
            Technical Skills:
            - Expert in React.js, Node.js, and Python
            - Extensive experience with AWS services
            - Strong background in database design (PostgreSQL, MongoDB)
            - DevOps practices and CI/CD pipelines
            
            Experience:
            - Led development of scalable web applications
            - Implemented microservices architecture
            - Optimized application performance
            - Mentored junior developers""",
            "skills": ["React.js", "Node.js", "Python", "AWS", "PostgreSQL", "MongoDB", "CI/CD", "Microservices"],
            "experience": 7
        },
        {
            "name": "Sarah Chen",
            "email": "sarah.chen@email.com",
            "resume": """Machine Learning Engineer with 4 years of experience.
            Technical Skills:
            - PyTorch and TensorFlow expert
            - Deep learning and computer vision
            - Python, NumPy, Pandas, Scikit-learn
            - MLOps and model deployment
            
            Experience:
            - Developed computer vision models
            - Implemented NLP solutions
            - Optimized model performance
            - Published research papers""",
            "skills": ["Python", "PyTorch", "TensorFlow", "Deep Learning", "Computer Vision", "NLP", "MLOps"],
            "experience": 4
        },
        {
            "name": "Michael Smith",
            "email": "michael.smith@email.com",
            "resume": """Cloud Solutions Architect with 6 years of experience.
            Technical Skills:
            - AWS/Azure certified
            - Kubernetes and Docker expertise
            - Infrastructure as Code (Terraform)
            - Security best practices
            
            Experience:
            - Designed cloud-native applications
            - Implemented security frameworks
            - Optimized cloud costs
            - Led cloud migrations""",
            "skills": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "Cloud Security", "System Design"],
            "experience": 6
        }
    ]
    
    created_candidates = []
    for candidate in candidates:
        try:
            response = requests.post(f"{BASE_URL}/candidates", json=candidate)
            if response.status_code == 200:
                created_candidates.append(response.json())
                logger.info(f"Created candidate: {candidate['name']}")
            else:
                logger.error(f"Failed to create candidate {candidate['name']}: {response.text}")
        except Exception as e:
            logger.error(f"Error creating candidate {candidate['name']}: {str(e)}")
    return created_candidates

def run_auto_screening():
    try:
        logger.info("\nStarting automated screening...")
        response = requests.post(f"{BASE_URL}/auto_screen")
        logger.info(f"Response status: {response.status_code}")
        logger.info(f"Response content: {response.text}")
        
        if response.status_code == 200:
            matches = response.json()
            logger.info(f"\nFound {len(matches)} matches:")
            for match in matches:
                logger.info(f"\nMatch Score: {match['match_score']:.2%}")
                logger.info(f"Job: {match.get('job', {}).get('title', 'Unknown Job')}")
                logger.info(f"Candidate: {match.get('candidate', {}).get('name', 'Unknown Candidate')}")
                logger.info(f"Matched Skills: {', '.join(match.get('skill_match_details', {}).get('matched_skills', []))}")
                
                if match.get('interview_questions'):
                    logger.info("\nSuggested Technical Questions:")
                    for q in match['interview_questions'].get('technical', []):
                        logger.info(f"- {q}")
                    logger.info("\nSuggested Behavioral Questions:")
                    for q in match['interview_questions'].get('behavioral', []):
                        logger.info(f"- {q}")
        else:
            logger.error(f"Screening failed: {response.text}")
    except Exception as e:
        logger.error(f"Error during screening: {str(e)}")
        logger.exception("Full traceback:")

if __name__ == "__main__":
    logger.info("Creating jobs...")
    jobs = create_jobs()
    logger.info(f"\nCreated {len(jobs)} jobs")
    
    logger.info("\nCreating candidates...")
    candidates = create_candidates()
    logger.info(f"\nCreated {len(candidates)} candidates")
    
    logger.info("\nWaiting for processing to complete...")
    time.sleep(5)  # Give the system time to process
    
    run_auto_screening()
