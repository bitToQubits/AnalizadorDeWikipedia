from fastapi import APIRouter

from .subrouters import articles

api_router = APIRouter()
api_router.include_router(articles.router)