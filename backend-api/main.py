import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, Response
from .middleware.routers.main import api_router
from .utils.config import settings


async def not_found(request, exc):
    return Response(content="Endpoint no definido.", status_code=404)

exceptions = {
    404: not_found
}

app = FastAPI(exception_handlers=exceptions)
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de AnalizarWikipedia"}