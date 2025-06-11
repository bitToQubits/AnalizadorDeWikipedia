import requests
from ....utils.config import settings

class ArticlesService:
    def search_wikipedia(self, search_term: str):
        request_session = requests.Session()

        url_wikipedia = settings.WIKIPEDIA_API_URL

        request_params = {
            "action": "opensearch",
            "namespace": "0",
            "search": search_term,
            "limit": "30",
            "format": "json"
        }

        request = request_session.get(url=url_wikipedia, params=request_params)
        request = request.json()
        
        # Procesamos la respuesta.

        wikipedia_results = \
        list(
            map(
                lambda article_name, article_link: (article_name, article_link), 
                request[1], request[3]
            )
        )

        return wikipedia_results

articles_service = ArticlesService()