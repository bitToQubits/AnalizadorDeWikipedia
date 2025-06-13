from fastapi import HTTPException

from fastapi.responses import JSONResponse

from layers.models.v1.db_handler import SessionDep
from layers.models.v1.articles_model import ArticlesCreate, ArticlesUpdate
from layers.services.v1.articles_service import articles_service

class ArticlesController():
    def search_wikipedia(self, search_term: str):
        search_term = search_term.strip()

        if not search_term:
            return JSONResponse(status_code=204, content=None)
        
        results_search = articles_service.search_wikipedia(search_term)

        return JSONResponse(content=results_search, status_code=200)

    def analyze_wikipedia_article(self, wikipedia_identificator: str):
        wikipedia_identificator = wikipedia_identificator.strip()

        if(wikipedia_identificator == ""):
            raise HTTPException(status_code=422, detail="Debes proporcionar un identificador para el artículo de Wikipedia")
        
        results_analysis = articles_service.analyze_wikipedia_article(wikipedia_identificator)

        return JSONResponse(content=results_analysis, status_code=200)
    
    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        articulo_id = articles_service.save_article(article_object, session)
        return JSONResponse({'message': "Artículo guardado exitosamente.", 'articulo_id': articulo_id}, status_code=201)
    
    def delete_article(self, article_id: int, session: SessionDep):
        articles_service.delete_article(article_id, session)
        return JSONResponse({'message': "Artículo eliminado exitosamente."}, status_code=200)
    
    def get_article(self, article_id: int, session: SessionDep):
        article = articles_service.get_article(article_id, session)
        return article
    
    def get_multiple_articles(self, offset: int, session: SessionDep):
        if offset < 0:
            raise HTTPException(status_code=422, detail="Debes proporcionar un offset válido para esta consulta.")
        
        articles_list = articles_service.get_multiple_articles(offset, session)

        return articles_list
    
    def update_article(self, article_object: ArticlesUpdate, article_id: int, session: SessionDep):
        articles_service.update_article(article_object, article_id, session)
        return JSONResponse({'message': "Artículo actualizado correctamente."}, status_code=200)

articles_controller = ArticlesController()