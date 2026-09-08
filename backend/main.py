from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pypdf
import io
import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Learn-With-Tech backend is running"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    reader = pypdf.PdfReader(io.BytesIO(contents))

    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    return {
        "filename": file.filename,
        "pages": len(reader.pages),
        "text": text[:15000],  # limit size sent to frontend/AI
    }


class TextRequest(BaseModel):
    text: str


def ask_gemini(prompt: str):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )
    return response.text


@app.post("/generate/course")
def generate_course(req: TextRequest):
    prompt = f"""
You are an expert course creator. Based on the following textbook content, create a structured course with 4-6 modules.
Return ONLY valid JSON, no extra text, in this exact format:
{{
  "title": "Course Title",
  "modules": [
    {{"id": 1, "title": "Module Title", "summary": "2-3 sentence summary of this module"}}
  ]
}}

Content:
{req.text}
"""
    raw = ask_gemini(prompt)
    raw = raw.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(raw)


@app.post("/generate/quiz")
def generate_quiz(req: TextRequest):
    prompt = f"""
Based on the following content, create a 5-question multiple choice quiz.
Return ONLY valid JSON, no extra text, in this exact format:
{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0
    }}
  ]
}}

Content:
{req.text}
"""
    raw = ask_gemini(prompt)
    raw = raw.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(raw)


@app.post("/generate/flashcards")
def generate_flashcards(req: TextRequest):
    prompt = f"""
Based on the following content, create 8 flashcards for studying.
Return ONLY valid JSON, no extra text, in this exact format:
{{
  "flashcards": [
    {{"front": "Term or question", "back": "Definition or answer"}}
  ]
}}

Content:
{req.text}
"""
    raw = ask_gemini(prompt)
    raw = raw.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(raw)


@app.post("/generate/summary")
def generate_summary(req: TextRequest):
    prompt = f"""
Create a concise study guide summary of the following content.
Use markdown formatting with headers and bullet points. Focus on key concepts a student needs to remember.

Content:
{req.text}
"""
    summary = ask_gemini(prompt)
    return {"summary": summary}