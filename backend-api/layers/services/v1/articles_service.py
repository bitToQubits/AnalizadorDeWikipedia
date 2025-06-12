import requests
from layers.models.v1.db_handler import SessionDep
from utils.config import settings
import wikipedia
import spacy
from layers.models.v1.articles_model import ArticlesCreate, articles_model

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
    
    def analyze_wikipedia_article(self, wikipedia_identificator: str):
        article_summary = wikipedia.summary(wikipedia_identificator, sentences = 3)

        article_page = wikipedia.page(wikipedia_identificator)

        dictionary_of_words = {}
        entities = []
        type_of_words = []

        # Vamos a procesar el articulo
        # Conteo de palabras
        array_of_words = article_page.content.split()

        for word in array_of_words:
            if(word not in settings.STOP_WORDS):
                if(dictionary_of_words.get(word) is None):
                    dictionary_of_words[word] = 1
                else:
                    dictionary_of_words[word] += 1

        # Cortesia de GeeksForGeeks
        dictionary_of_words = \
        {k: v for k, v in sorted(dictionary_of_words.items(), key=lambda item: item[1], reverse=True)}

        if(len(dictionary_of_words) >= 50):
            dictionary_of_words = dict(list(dictionary_of_words.items())[:50])

        # Reconocimiento de entidades
        model_for_recognizing_entities = spacy.load("en_core_web_sm")
        text_processed_for_entities = model_for_recognizing_entities(article_page.content)

        for index, entity in enumerate(text_processed_for_entities.ents):
            if(index == 50):
                break
            entities.append((entity.text, entity.label_))

        # Identificando que tipo de palabra es cada una
        for index, type_word in enumerate(text_processed_for_entities):
            if(index == 50):
                break
            type_of_words.append((type_word.text, type_word.pos_))
        
        return {
            "article_summary": article_summary,
            "dictionary_of_words": dictionary_of_words,
            "entities" : entities,
            "type_of_words": type_of_words
        }
    
    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        articles_model.save_article(article_object, session)

    def delete_article(self, article_id: int, session: SessionDep):
        articles_model.delete_article(article_id, session)

articles_service = ArticlesService()