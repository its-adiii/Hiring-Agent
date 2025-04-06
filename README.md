# AI Recruitment System

An intelligent recruitment system that leverages multiple AI agents to streamline the hiring process, from resume screening to candidate evaluation.

## Table of Contents
- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- **Intelligent Resume Analysis**: Automated extraction of skills, experience, and qualifications
- **Job Description Processing**: Smart parsing and requirement analysis
- **Advanced Candidate Matching**: AI-powered matching algorithm
- **Automated Screening**: Dynamic question generation and evaluation
- **Interactive Dashboard**: Real-time metrics and analytics
- **Interview Management**: Structured interview process with AI assistance

## System Architecture

### Backend Components
1. **AI Agents**
   - Resume Analysis Agent
   - Job Description Agent
   - Matching Agent
   - Screening Agent
   - Interview Agent

2. **Database**
   - PostgreSQL for structured data
   - Vector storage for embeddings

3. **API Layer**
   - FastAPI framework
   - RESTful endpoints
   - WebSocket support for real-time updates

### Frontend Components
- React-based SPA
- Material-UI components
- Context API for state management
- Recharts for data visualization

## Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL 13+
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/its-adiii/Hiring-Agent.git
cd Hiring-Agent
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb hiring_agent_db

# Run migrations
cd backend
alembic upgrade head
```

## Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/hiring_agent_db
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET_KEY=your_jwt_secret
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000/ws
```

## Running the Application

### 1. Start Backend Server
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Documentation

### Main Endpoints

#### Authentication
- POST /auth/login
- POST /auth/register

#### Candidates
- GET /candidates
- POST /candidates
- GET /candidates/{id}
- PUT /candidates/{id}

#### Jobs
- GET /jobs
- POST /jobs
- GET /jobs/{id}
- PUT /jobs/{id}

#### Screening
- POST /screening/start
- GET /screening/{id}/status
- POST /screening/{id}/evaluate

#### Dashboard
- GET /dashboard
- GET /dashboard/metrics
- GET /dashboard/analytics

## Project Structure

```
hiring-agent/
├── backend/
│   ├── agents/
│   │   ├── base_agent.py
│   │   ├── resume_agent.py
│   │   ├── jd_agent.py
│   │   ├── matching_agent.py
│   │   ├── screening_agent.py
│   │   └── interview_agent.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── api/
│   │   ├── utils/
│   │   └── App.js
│   ├── public/
│   └── package.json
└── README.md
```

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- OpenAI API
- PostgreSQL
- Alembic
- Pydantic
- PyTest

### Frontend
- React
- Material-UI
- Recharts
- Axios
- React Router
- Context API

### DevOps & Tools
- Git
- Docker
- GitHub Actions
- ESLint
- Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
