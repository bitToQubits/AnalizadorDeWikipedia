import importlib
from fastapi import APIRouter, Depends, HTTPException
from layers.controllers.v1.articles_controller import articles_controller

router = APIRouter(
    prefix="/articles",
    tags=["articles"],
)

@router.get('/search_wikipedia/{search_term}')
async def search_wikipedia(search_term: str):
    return articles_controller.search_wikipedia(search_term)

@router.get('/analyze/{wikipedia_identificator}')
async def analyze_wikipedia_article(wikipedia_identificator: str):
    return articles_controller.analyze_wikipedia_article(wikipedia_identificator)