import importlib
from fastapi import APIRouter, Depends, HTTPException
from ....layers.controllers.v1.articles import articles_controller

router = APIRouter(
    prefix="/articles",
    tags=["articles"],
)

@router.get('/search_wikipedia/{search_term}')
async def search_wikipedia(search_term: str):
    return articles_controller.search_wikipedia(search_term)