from fastapi import Response
import json
from ...services.v1.articles import articles_service

class ArticlesController():
    def search_wikipedia(self, search_term: str):
        search_term = search_term.strip()

        if(search_term == ""):
            return Response(status_code=204)
        
        results_from_the_search = articles_service.search_wikipedia(search_term)

        return Response(content=json.dumps(results_from_the_search), status_code=200)

articles_controller = ArticlesController()