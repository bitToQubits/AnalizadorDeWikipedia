from fastapi import APIRouter
from middleware.routers.subrouters import articles_subrouter

api_router = APIRouter()
api_router.include_router(articles_subrouter.router)