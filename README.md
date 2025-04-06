# AI Recruitment System

A multi-agent AI system for automated recruitment processes using FLAN-T5-Small model.

## Features

- 🤖 Multi-agent AI system (JD Processing, Candidate Screening, Interview)
- 🧠 FLAN-T5-Small model for natural language processing
- 🚀 FastAPI backend with async processing
- ⚛️ React frontend with Material UI
- 📊 Real-time dashboard
- 🗄️ SQLite database with SQLAlchemy ORM

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/its-adiii/AI-Recruitment-System.git
cd AI-Recruitment-System
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
cd backend
python -m uvicorn main:app --reload
```

The backend server will start at http://localhost:8000

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will be available at http://localhost:3000

## Project Structure

```
AI-Recruitment-System/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py
│   │   ├── jd_agent.py
│   │   ├── candidate_agent.py
│   │   └── interview_agent.py
│   ├── data/
│   │   └── recruitment.db
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── database.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
├── requirements.txt
└── README.md
```

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for the complete API documentation.

Key endpoints:
- `/dashboard` - Get dashboard statistics and metrics
- `/debug/data` - View all database contents (development only)

## Environment Setup

The system will automatically:
1. Create necessary database tables
2. Initialize the FLAN-T5-Small model
3. Generate sample data for testing

## Common Issues & Solutions

1. **Model Download**: On first run, the system will download the FLAN-T5-Small model (~300MB). Ensure you have a stable internet connection.

2. **CUDA Support**: The system automatically detects GPU availability. If CUDA is available, it will use GPU acceleration.

3. **Database Location**: The SQLite database is created at `backend/data/recruitment.db`. Ensure the directory has write permissions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
