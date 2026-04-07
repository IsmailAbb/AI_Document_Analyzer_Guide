from openai import AsyncOpenAI
import os

client = AsyncOpenAI(
    api_key='ollama',
    base_url=os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434/v1')
)

PROMPTS = {
    'short': '''You are a document analyst. Given document text, return JSON with:
  summary (2-3 sentences), key_points (3-5 items as strings), entities (important ones as {name, type}),
  document_type (invoice|contract|report|other).
  Return ONLY valid JSON, no extra text.''',

    'medium': '''You are a document analyst. Carefully analyze the document text and return JSON with:
  summary (a detailed paragraph of 4-6 sentences covering the main purpose, context, and key findings),
  key_points (5-8 specific items as strings — include numbers, dates, and important details),
  entities (all people, companies, locations, monetary amounts, and dates found, as {name, type}),
  document_type (invoice|contract|report|other).
  Be specific and include concrete details from the document. Return ONLY valid JSON, no extra text.''',

    'long': '''You are a thorough document analyst. Perform an exhaustive analysis of the document text and return JSON with:
  summary (a comprehensive analysis of 6-10 sentences covering the document's purpose, all major points, context, implications, and any notable details or patterns),
  key_points (10-15 specific items as strings — be exhaustive, capture every significant fact, figure, date, obligation, condition, and detail mentioned in the document),
  entities (every entity found including all people, companies, organizations, locations, monetary amounts, dates, percentages, account numbers, and references, as {name, type}),
  document_type (invoice|contract|report|other).
  Leave nothing out. Every detail matters. Return ONLY valid JSON, no extra text.'''
}

async def analyze(text: str, detail: str = 'medium') -> dict:
    system_prompt = PROMPTS.get(detail, PROMPTS['medium'])
    resp = await client.chat.completions.create(
        model='llama3.2:1b',
        response_format={'type': 'json_object'},
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': text}
        ]
    )
    return resp.choices[0].message.content
