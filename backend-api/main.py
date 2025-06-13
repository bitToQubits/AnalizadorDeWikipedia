import sys
import os

from fastapi.responses import JSONResponse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI, Response
from .middleware.routers.main import api_router
from .utils.config import settings
from layers.models.v1.db_handler import create_db_and_tables
from contextlib import asynccontextmanager
from starlette.exceptions import HTTPException as StarletteHTTPException

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse({"message":str(exc.detail)}, status_code=exc.status_code)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de AnalizarWikipedia"}