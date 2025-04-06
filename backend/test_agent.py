import requests
import json

def test_job_creation():
    url = "http://localhost:8000/jobs"
    data = {
        "title": "AI Engineer",
        "description": "Looking for an AI Engineer with Python and ML experience. Must have experience with PyTorch and transformers."
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_job_creation()
