class DataModels():
    article_model: dict = {
        "ID": "id",
        "name": "article_name",
        "summary": "article_summary",
        "note": "note",
        "created_at": "creation_date",
        "dictionary": "dictionary_of_words",
        "type_words": "type_words",
        "entities": "entities"
    }

    dictionary_model: dict = {
        "ID": "id",
        "ID_article": "id_article",
        "name": "name",
        "counter": "counter",
    }

    entity_model: dict = {
        "ID": "id",
        "ID_article": "id_article",
        "word": "word",
        "entity": "entity",
    }

    types_words_model: dict = {
        "ID": "id",
        "ID_article": "id_article",
        "word": "word",
        "type_word": "type_word"
    }

data_models = DataModels()