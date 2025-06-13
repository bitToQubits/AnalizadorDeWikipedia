from fastapi import APIRouter
from layers.controllers.v1.articles_controller import articles_controller
from layers.models.v1.db_handler import SessionDep
from layers.models.v1.articles_model import ArticlesCreate, ArticlesUpdate

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

@router.post('/')
async def save_article(article_object: ArticlesCreate, session: SessionDep):
    return articles_controller.save_article(article_object, session)

@router.delete('/{article_id}')
async def delete_article(article_id: int, session: SessionDep):
    return articles_controller.delete_article(article_id, session)

@router.get('/list')
async def get_multiple_articles(offset: int, session: SessionDep):
    return articles_controller.get_multiple_articles(offset, session)

@router.get('/{article_id}')
async def get_article(article_id: int, session: SessionDep):
    return articles_controller.get_article(article_id, session)

@router.patch('/{article_id}')
async def update_article(article_object: ArticlesUpdate, article_id: int, session: SessionDep):
    return articles_controller.update_article(article_object, article_id, session)