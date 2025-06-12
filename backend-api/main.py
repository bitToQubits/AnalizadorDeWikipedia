import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, Response
from .middleware.routers.main import api_router
from .utils.config import settings
from layers.models.v1.db_handler import create_db_and_tables
from contextlib import asynccontextmanager
import json

async def not_found(request, exc):
    return Response(content=json.dumps({'message': "Endpoint no definido."}), status_code=404)

exceptions = {
    404: not_found
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(exception_handlers=exceptions, lifespan=lifespan) # type: ignore
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de AnalizarWikipedia"}