from fastapi import HTTPException

from fastapi.responses import JSONResponse

from layers.models.v1.db_handler import SessionDep
from layers.models.v1.articles_model import ArticlesCreate, ArticlesUpdate
from layers.services.v1.articles_service import articles_service
from wikipedia.exceptions import PageError, DisambiguationError, HTTPTimeoutError
import sys
from sqlalchemy.exc import DataError, IntegrityError

class ArticlesController():
    def search_wikipedia(self, search_term: str):
        search_term = search_term.strip()

        if not search_term:
            return JSONResponse(status_code=204, content=None)
        
        try:
            results_search = articles_service.search_wikipedia(search_term)
        except HTTPTimeoutError:
            raise HTTPException(status_code=500, detail="Error en los servidores de Wikipedia. Favor reintentarlo más tarde")
        else:
            return JSONResponse(content=results_search, status_code=200)

    def analyze_wikipedia_article(self, wikipedia_identificator: str):
        wikipedia_identificator = wikipedia_identificator.strip()

        if(wikipedia_identificator == ""):
            raise HTTPException(status_code=422, detail="Debes proporcionar un identificador para el artículo de Wikipedia")
            
        try:
            results_analysis = articles_service.analyze_wikipedia_article(wikipedia_identificator)
        except PageError: 
            raise HTTPException(status_code=404, detail="Este artículo realmente no existe")
        except DisambiguationError:
            raise HTTPException(status_code=404, detail="El término que usaste lleva a una desambiguación, no a un artículo. Usa otro termino")
        except HTTPTimeoutError:
            raise HTTPException(status_code=500, detail="Error en los servidores de Wikipedia. Favor reintentarlo más tarde")
        else:
            return JSONResponse(content=results_analysis, status_code=200)
    
    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        article_id = articles_service.save_article(article_object, session)
        return JSONResponse({'message': "Artículo guardado exitosamente.", 'article_id': article_id}, status_code=201)
    
    def delete_article(self, article_id: int, session: SessionDep):
        articles_service.delete_article(article_id, session)
        return JSONResponse({'message': "Artículo eliminado exitosamente."}, status_code=200)
    
    def get_article(self, article_id: int, session: SessionDep):
        article = articles_service.get_article(article_id, session)
        return article
    
    def get_multiple_articles(self, offset: int, session: SessionDep):
        if offset < 0 and offset > sys.maxsize:
            raise HTTPException(status_code=422, detail="Debes proporcionar un offset válido para esta consulta.")
        
        articles_list = articles_service.get_multiple_articles(offset, session)

        return articles_list
    
    def update_article(self, article_object: ArticlesUpdate, article_id: int, session: SessionDep):
        articles_service.update_article(article_object, article_id, session)
        return JSONResponse({'message': "Artículo actualizado correctamente."}, status_code=200)

articles_controller = ArticlesController()