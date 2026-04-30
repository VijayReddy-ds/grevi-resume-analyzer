from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
import uvicorn
import os
import io

from utils.document_parser import extract_text
from utils.analyzer import generate_json_output

app = FastAPI(title="Grevi Resume Analyzer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FileBytesWrapper:
    """A simple wrapper to mimic the uploaded_file object expected by extract_text"""
    def __init__(self, name, content):
        self.name = name
        self.content = content
        
    def read(self):
        return self.content

@app.post("/analyze")
async def analyze_resume(
    resume_file: UploadFile = File(...),
    jd_type: str = Form(...),  # "text" or "file"
    jd_text: Optional[str] = Form(None),
    jd_file: Optional[UploadFile] = File(None)
):
    try:
        # Read Resume File
        resume_content = await resume_file.read()
        resume_wrapper = FileBytesWrapper(resume_file.filename, resume_content)
        resume_extracted_text = extract_text(resume_wrapper)
        
        # Read Job Description
        jd_extracted_text = ""
        if jd_type == "text":
            jd_extracted_text = jd_text or ""
        elif jd_type == "file" and jd_file is not None:
            jd_content = await jd_file.read()
            jd_wrapper = FileBytesWrapper(jd_file.filename, jd_content)
            jd_extracted_text = extract_text(jd_wrapper)
        else:
            raise HTTPException(status_code=400, detail="Job description text or file must be provided.")
            
        if not resume_extracted_text or not jd_extracted_text:
            raise HTTPException(status_code=400, detail="Failed to extract text from the provided documents.")
            
        # Generate Analysis
        results = generate_json_output(resume_extracted_text, jd_extracted_text)
        
        return results

    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Serve Frontend static files if they exist
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
