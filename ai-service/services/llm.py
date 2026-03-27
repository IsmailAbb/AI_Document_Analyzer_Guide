from openai import AsyncOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv('OPENAI_API_KEY'))

SYSTEM = '''You are a document analyst. Given document text, return JSON with:
  summary (2-3 sentences), key_points (array), entities (array of {name, type}),
  document_type (invoice|contract|report|other).'''

async def analyze(text: str) -> dict:
    resp = await client.chat.completions.create(
        model='gpt-4o-mini',
        response_format={'type': 'json_object'},
        messages=[
            {'role': 'system', 'content': SYSTEM},
            {'role': 'user', 'content': text}
        ]
    )
    return resp.choices[0].message.content