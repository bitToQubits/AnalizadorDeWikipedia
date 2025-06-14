import sys
import os
import spacy
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi.responses import JSONResponse
from fastapi import FastAPI, Response
from middleware.routers.main import api_router
from utils.config import settings
from layers.models.v1.db_handler import create_db_and_tables, close_db_connection
from contextlib import asynccontextmanager
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    settings.model_for_recognizing_language = spacy.load("es_core_news_md")
    yield
    close_db_connection()

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse({"message":str(exc.detail)}, status_code=exc.status_code)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de AnalizarWikipedia"}