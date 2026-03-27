from fastapi import FastAPI
from routers.analyze import router

app = FastAPI(title='AI Document Analyzer Service')
app.include_router(router)

@app.get('/health')
async def health():
    return {'status': 'ok'}