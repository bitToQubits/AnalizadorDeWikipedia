from fastapi import Response
import json
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
            return Response(status_code=204)
        
        results_analysis = articles_service.analyze_wikipedia_article(wikipedia_identificator)

        return Response(content=json.dumps(results_analysis), status_code=200)

articles_controller = ArticlesController()