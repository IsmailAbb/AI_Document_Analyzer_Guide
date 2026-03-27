from fastapi import APIRouter, UploadFile, HTTPException
from services.pdf_parser import extract_text
from services.llm import analyze
import json

router = APIRouter(prefix='/analyze')

@router.post('/')
async def analyze_document(file: UploadFile):
    if file.content_type != 'application/pdf':
        raise HTTPException(400, 'Only PDFs accepted')
    raw = await file.read()
    text = extract_text(raw)
    result = await analyze(text)
    return json.loads(result)