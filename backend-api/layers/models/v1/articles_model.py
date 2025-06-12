from fastapi import HTTPException
from layers.models.v1.db_handler import SessionDep
from sqlmodel import Field, SQLModel, col, delete, select

# Definicion de entidades

class ArticlesBase(SQLModel):
    article_name: str 
    article_summary: str
    note: str | None = None

class ArticlesCreate(ArticlesBase):
    dictionary_of_words: dict
    entities: list
    type_of_words: list

class Articles(ArticlesBase, table=True):
    id: int = Field(default=None, primary_key=True)

class ArticlesPublic(ArticlesBase):
    id: int
    dictionary_of_words: dict
    entities: list
    type_of_words: list

class ArticlesUpdate(SQLModel):
    article_name: str | None = None
    article_summary: str | None = None
    note: str | None = None

class ArticlesDictionaryBase(SQLModel):
    id_article: int
    name: str
    counter: int

class Articles_Dictionary(ArticlesDictionaryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ArticlesTypesWordsBase(SQLModel):
    id_article: int
    word: str
    type_word: str

class Article_Types_Words(ArticlesTypesWordsBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ArticlesEntitiesBase(SQLModel):
    id_article: int
    word: str
    entity: str

class Articles_Entities(ArticlesEntitiesBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

# Definicion del modelo principal
class ArticlesModel():
    def save_article_entities(self, entities_object: ArticlesEntitiesBase, session: SessionDep):
        db_entities = Articles_Entities.model_validate(entities_object)
        session.add(db_entities)
    
    def save_article_types_words(self, types_words_object: ArticlesTypesWordsBase, session: SessionDep):
        db_types_words = Article_Types_Words.model_validate(types_words_object)
        session.add(db_types_words)
    
    def save_article_dictionary(self, articles_dictionary_object: ArticlesDictionaryBase, session: SessionDep):
        db_dictionary = Articles_Dictionary.model_validate(articles_dictionary_object)
        session.add(db_dictionary)

    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        db_article = Articles.model_validate(article_object)
        session.add(db_article)
        session.commit()
        session.refresh(db_article)
        article_id = db_article.id

        for name, count in article_object.dictionary_of_words.items():
            dictionary_object = ArticlesDictionaryBase(id_article=article_id, name=name, counter=count)
            self.save_article_dictionary(dictionary_object, session)

        for type_word_array in article_object.type_of_words:
            type_word_object = \
            ArticlesTypesWordsBase(id_article=article_id, word=type_word_array[0], type_word=type_word_array[1])
            self.save_article_types_words(type_word_object, session)

        for entity in article_object.entities:
            entity_object = ArticlesEntitiesBase(id_article=article_id, word=entity[0], entity=entity[1])
            self.save_article_entities(entity_object, session)

        session.commit()

        return article_id

    def delete_article(self, article_id: int, session: SessionDep):
        article = session.get(Articles, article_id)

        if not article:
            raise HTTPException(status_code=404, detail="Artículo no encontrado")

        entities = delete(Articles_Entities).where(col(Articles_Entities.id_article) == article_id)
        session.exec(entities) # type: ignore

        dictionary = delete(Articles_Dictionary).where(col(Articles_Dictionary.id_article) == article_id)
        session.exec(dictionary) # type: ignore

        type_word = delete(Article_Types_Words).where(col(Article_Types_Words.id_article) == article_id)
        session.exec(type_word) # type: ignore

        session.commit()

    def get_article(self, article_id: int, session: SessionDep):
        article = session.get(Articles, article_id)

        if not article:
            raise HTTPException(status_code=404, detail="Artículo no encontrado")

        entities = select(
            Articles_Entities.word,
            Articles_Entities.entity
        ).where(col(Articles_Entities.id_article) == article_id)
        entities = session.exec(entities)

        dictionary = select(
            Articles_Dictionary.name,
            Articles_Dictionary.counter
        ).where(col(Articles_Dictionary.id_article) == article_id)
        dictionary = session.exec(dictionary)

        type_word = select(
            Article_Types_Words.word,
            Article_Types_Words.type_word
        ).where(col(Article_Types_Words.id_article) == article_id)
        type_word = session.exec(type_word)

        session.commit()

        article_object = {
            "id": article.id,
            "article_name": article.article_name,
            "article_summary": article.article_summary,
            "dictionary_of_words": dictionary,
            "type_word": type_word,
            "entities": entities
        }

        return article_object
    
    def get_multiple_articles(self, offset: int, session: SessionDep):
        # articles_list_not_processed = select(
        #     Articles,
        #     Articles_Dictionary,
        #     Article_Types_Words,
        #     Articles_Entities
        # ).where(
        #     Articles.id == 
        #     Article_Types_Words.id_article == 
        #     Articles_Entities.id_article == 
        #     Articles_Dictionary.id_article
        # )
        articles_list_not_processed = session.exec(articles_list_not_processed)

        for articles, dictionary, types_words, entities in articles_list_not_processed:
            print(articles, dictionary, types_words, entities)
            break

        return []

articles_model = ArticlesModel()