from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key='ollama',
    base_url='http://localhost:11434/v1'
)

SYSTEM = '''You are a document analyst. Given document text, return JSON with:
  summary (2-3 sentences), key_points (array), entities (array of {name, type}),
  document_type (invoice|contract|report|other).
  Return ONLY valid JSON, no extra text.'''

async def analyze(text: str) -> dict:
    resp = await client.chat.completions.create(
        model='llama3',
        response_format={'type': 'json_object'},
        messages=[
            {'role': 'system', 'content': SYSTEM},
            {'role': 'user', 'content': text}
        ]
    )
    return resp.choices[0].message.content