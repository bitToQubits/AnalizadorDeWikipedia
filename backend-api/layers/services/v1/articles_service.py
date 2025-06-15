import requests
from layers.models.v1.db_handler import SessionDep
from utils.data_models import data_models
from utils.config import settings
import wikipedia
from layers.models.v1.articles_model import ArticlesCreate, ArticlesUpdate, articles_model, ArticlesPublic
import re

wikipedia.set_lang("es")
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

        article_summary = re.sub(r'={2,}[^=]*={2,}', '', article_summary)
        article_summary = re.sub(r'\[\d+\]', '', article_summary)

        article_page = wikipedia.page(wikipedia_identificator)

        dictionary_of_words = {}
        entities = []
        type_of_words = []

        # Vamos a procesar el articulo
        array_of_words = article_page.content.split()

        for word in array_of_words:
            word = word.lower()

            word = re.sub(r'[^a-zA-ZÀ-ÿ]', '', word)
            
            if word not in settings.STOP_WORDS and word != "" and len(word) > 1:
                if dictionary_of_words.get(word) is None:
                    dictionary_of_words[word] = 1
                else:
                    dictionary_of_words[word] += 1

        dictionary_of_words = \
        {k: v for k, v in sorted(dictionary_of_words.items(), key=lambda item: item[1], reverse=True)}

        if len(dictionary_of_words) >= 50:
            dictionary_of_words = dict(list(dictionary_of_words.items())[:50])

        string_most_common_words = " ".join(list(dictionary_of_words))
        
        # Reconocimiento de entidades
        text_processed_for_entities = settings.model_for_recognizing_language(string_most_common_words)

        for index, entity in enumerate(text_processed_for_entities.ents):
            if index == 50:
                break
            entities.append((entity.text, entity.label_))

        # Identificando que tipo de palabra es cada una
        # verbo, pronom, etc
        for index, type_word in enumerate(text_processed_for_entities):
            if index == 50:
                break

            if(type_word.pos_ in settings.TRANSLATIONS_WORD_TYPE):
                type_word_in_spanish = settings.TRANSLATIONS_WORD_TYPE[type_word.pos_]
            else:
                type_word_in_spanish = type_word.pos_

            type_of_words.append((type_word.text, type_word_in_spanish))
        
        return {
            "article_summary": article_summary,
            "dictionary_of_words": dictionary_of_words,
            "entities" : entities,
            "type_of_words": type_of_words
        }
    
    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        return articles_model.save_article(article_object, session)

    def delete_article(self, article_id: int, session: SessionDep):
        articles_model.delete_article(article_id, session)

    def get_article(self, article_id: int, session: SessionDep):
        article_not_processed = articles_model.get_article(article_id, session)
        dictionary_of_words = {}
        types_word_array = []
        entities_array = []

        for dictionary in article_not_processed[data_models.article_model["dictionary"]]:
            dictionary_of_words[dictionary.name] = dictionary.counter

        for type_word in article_not_processed[data_models.article_model["type_words"]]:
            types_word_array.append([type_word.word, type_word.type_word])

        for entity in article_not_processed[data_models.article_model["entities"]]:
            entities_array.append([entity.word, entity.entity])
        
        return ArticlesPublic(
            id=article_not_processed["id"], 
            article_name=article_not_processed["article_name"],
            article_summary=article_not_processed["article_summary"],
            dictionary_of_words=dictionary_of_words,
            entities=entities_array,
            type_of_words=types_word_array,
            note=article_not_processed["note"]
        )
    
    def get_multiple_articles(self, offset:int, session: SessionDep):
        articles_list = articles_model.get_multiple_articles(offset, session)
        return articles_list
    
    def update_article(self, article_object: ArticlesUpdate, article_id: int, session: SessionDep):
        articles_model.update_article(article_object,article_id, session)

articles_service = ArticlesService()