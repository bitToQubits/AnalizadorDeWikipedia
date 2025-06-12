from fastapi import Response
import json
from layers.models.v1.db_handler import SessionDep
from layers.models.v1.articles_model import ArticlesCreate
from layers.services.v1.articles_service import articles_service

class ArticlesController():
    def search_wikipedia(self, search_term: str):
        search_term = search_term.strip()

        if(search_term == ""):
            return Response(status_code=204)
        
        results_search = articles_service.search_wikipedia(search_term)

        return Response(content=json.dumps(results_search), status_code=200)

    def analyze_wikipedia_article(self, wikipedia_identificator: str):
        wikipedia_identificator = wikipedia_identificator.strip()

        if(wikipedia_identificator == ""):
            return Response(content=json.dumps({'message': "Debes proporcionar un identificador del artículo."}), status_code=422)
        
        results_analysis = articles_service.analyze_wikipedia_article(wikipedia_identificator)

        return Response(content=json.dumps(results_analysis), status_code=200)
    
    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        articles_service.save_article(article_object, session)

        return Response(content=json.dumps({'message': "Artículo guardado exitosamente."}), status_code=201)
    
    def delete_article(self, article_id: int, session: SessionDep):
        articles_service.delete_article(article_id, session)
        
        return Response(content=json.dumps({'message': "Artículo eliminado exitosamente."}), status_code=200)



articles_controller = ArticlesController()