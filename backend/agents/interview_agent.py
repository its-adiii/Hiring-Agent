from typing import List, Dict
from .base_agent import BaseAgent

class InterviewAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    def generate_technical_questions(self, job_description: str, candidate_skills: List[str]) -> List[Dict]:
        prompt = f"""
        Generate 5 technical interview questions based on this job description:
        {job_description}
        
        And candidate's skills:
        {', '.join(candidate_skills)}
        
        Format each question as:
        1. Question
        2. Expected answer key points
        3. Difficulty level (1-5)
        """
        
        response = self.process_text(prompt)
        questions = self._parse_questions(response)
        return questions

    def generate_behavioral_questions(self, job_description: str) -> List[Dict]:
        prompt = f"""
        Generate 3 behavioral interview questions based on this job description:
        {job_description}
        
        Questions should assess:
        1. Leadership and teamwork
        2. Problem-solving approach
        3. Cultural fit
        
        Format each question with:
        1. Question
        2. What to look for in the answer
        """
        
        response = self.process_text(prompt)
        questions = self._parse_questions(response)
        return questions

    def evaluate_response(self, question: str, expected_answer: str, candidate_response: str) -> Dict:
        prompt = f"""
        Evaluate this interview response:
        
        Question: {question}
        Expected key points: {expected_answer}
        Candidate's response: {candidate_response}
        
        Provide:
        1. Score (0-10)
        2. Strengths
        3. Areas for improvement
        """
        
        response = self.process_text(prompt)
        evaluation = self._parse_evaluation(response)
        return evaluation

    def generate_feedback(self, technical_scores: List[float], behavioral_scores: List[float]) -> Dict:
        avg_technical = sum(technical_scores) / len(technical_scores)
        avg_behavioral = sum(behavioral_scores) / len(behavioral_scores)
        overall_score = (avg_technical * 0.7) + (avg_behavioral * 0.3)
        
        prompt = f"""
        Generate interview feedback:
        Technical score: {avg_technical}/10
        Behavioral score: {avg_behavioral}/10
        Overall score: {overall_score}/10
        
        Provide:
        1. Summary of performance
        2. Key strengths
        3. Areas for improvement
        4. Hiring recommendation (Strongly Recommend, Recommend, Consider, Do Not Recommend)
        """
        
        response = self.process_text(prompt)
        feedback = self._parse_feedback(response)
        return feedback

    def _parse_questions(self, text: str) -> List[Dict]:
        # Parse the generated questions into structured format
        # This is a simplified implementation
        questions = []
        lines = text.strip().split('\n')
        current_question = {}
        
        for line in lines:
            if line.startswith('Q:') or line.startswith('Question:'):
                if current_question:
                    questions.append(current_question)
                current_question = {'question': line.split(':', 1)[1].strip()}
            elif line.startswith('A:') or line.startswith('Answer:'):
                current_question['expected_answer'] = line.split(':', 1)[1].strip()
            elif line.startswith('Level:') or line.startswith('Difficulty:'):
                current_question['difficulty'] = int(line.split(':', 1)[1].strip())
        
        if current_question:
            questions.append(current_question)
        
        return questions

    def _parse_evaluation(self, text: str) -> Dict:
        # Parse the evaluation response into structured format
        lines = text.strip().split('\n')
        evaluation = {
            'score': 0,
            'strengths': [],
            'improvements': []
        }
        
        current_section = None
        for line in lines:
            if 'score:' in line.lower():
                evaluation['score'] = float(line.split(':')[1].strip())
            elif 'strength' in line.lower():
                current_section = 'strengths'
            elif 'improvement' in line.lower():
                current_section = 'improvements'
            elif line.strip() and current_section:
                evaluation[current_section].append(line.strip())
        
        return evaluation

    def _parse_feedback(self, text: str) -> Dict:
        # Parse the feedback response into structured format
        lines = text.strip().split('\n')
        feedback = {
            'summary': '',
            'strengths': [],
            'improvements': [],
            'recommendation': ''
        }
        
        current_section = None
        for line in lines:
            if 'summary' in line.lower():
                current_section = 'summary'
            elif 'strength' in line.lower():
                current_section = 'strengths'
            elif 'improvement' in line.lower():
                current_section = 'improvements'
            elif 'recommendation' in line.lower():
                feedback['recommendation'] = line.split(':')[1].strip()
            elif line.strip() and current_section:
                if current_section == 'summary':
                    feedback['summary'] = line.strip()
                else:
                    feedback[current_section].append(line.strip())
        
        return feedback
