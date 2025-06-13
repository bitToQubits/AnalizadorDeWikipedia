from fastapi import HTTPException
from layers.models.v1.db_handler import SessionDep
from sqlmodel import Field, Relationship, SQLModel, col, delete, select
from datetime import datetime
from utils.data_models import data_models
# Definicion de entidades

class ArticlesBase(SQLModel):
    article_name: str 
    article_summary: str
    note: str | None = None

class Articles(ArticlesBase, table=True):
    id: int = Field(default=None, primary_key=True)
    dictionary_of_words_item: list["Articles_Dictionary"] = Relationship(back_populates="article")
    entities_item: list["Articles_Entities"] = Relationship(back_populates="article")
    types_words_item: list["Articles_Types_Words"] = Relationship(back_populates="article")
    creation_date: datetime = Field(default_factory=lambda: datetime.now())

class ArticlesPublic(ArticlesBase):
    id: int
    dictionary_of_words: dict
    entities: list
    type_of_words: list
    creation_date: datetime = Field(default_factory=lambda: datetime.now())

class ArticlesCreate(ArticlesBase):
    dictionary_of_words: dict
    entities: list
    type_of_words: list

class ArticlesUpdate(SQLModel):
    note: str | None = None

class ArticlesDictionaryBase(SQLModel):
    id_article: int = Field(foreign_key="articles.id", index=True)
    name: str
    counter: int

class Articles_Dictionary(ArticlesDictionaryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    article: Articles = Relationship(back_populates="dictionary_of_words_item")

class ArticlesTypesWordsBase(SQLModel):
    id_article: int = Field(foreign_key="articles.id", index=True)
    word: str
    type_word: str

class Articles_Types_Words(ArticlesTypesWordsBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    article: Articles = Relationship(back_populates="types_words_item")

class ArticlesEntitiesBase(SQLModel):
    id_article: int = Field(foreign_key="articles.id", index=True)
    word: str
    entity: str

class Articles_Entities(ArticlesEntitiesBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    article: Articles = Relationship(back_populates="entities_item")

# Definicion del modelo principal
class ArticlesModel():
    def save_article_entities(self, entities_object: ArticlesEntitiesBase, session: SessionDep):
        db_entities = Articles_Entities.model_validate(entities_object)
        session.add(db_entities)
    
    def save_articles_types_words(self, types_words_object: ArticlesTypesWordsBase, session: SessionDep):
        db_types_words = Articles_Types_Words.model_validate(types_words_object)
        session.add(db_types_words)
    
    def save_article_dictionary(self, articles_dictionary_object: ArticlesDictionaryBase, session: SessionDep):
        db_dictionary = Articles_Dictionary.model_validate(articles_dictionary_object)
        session.add(db_dictionary)

    def save_article(self, article_object: ArticlesCreate, session: SessionDep):
        dictionary_of_words = article_object.dictionary_of_words.items()
        type_of_words = article_object.type_of_words
        entities = article_object.entities

        db_article = Articles.model_validate(article_object)
        session.add(db_article)
        session.commit()
        session.refresh(db_article)
        article_id = db_article.id

        for name, count in dictionary_of_words:
            dictionary_object = ArticlesDictionaryBase(id_article=article_id, name=name, counter=count)
            self.save_article_dictionary(dictionary_object, session)

        for type_word_array in type_of_words:
            type_word_object = \
            ArticlesTypesWordsBase(id_article=article_id, word=type_word_array[0], type_word=type_word_array[1])
            self.save_articles_types_words(type_word_object, session)

        for entity in entities:
            entity_object = ArticlesEntitiesBase(id_article=article_id, word=entity[0], entity=entity[1])
            self.save_article_entities(entity_object, session)

        session.commit()

        return article_id

    def delete_article(self, article_id: int, session: SessionDep):
        article = session.get(Articles, article_id)

        if not article:
            raise HTTPException(status_code=404, detail="Artículo para eliminar no encontrado")

        # nota: ignore el error de tipado aqui porque es un error
        # actual de sqlmodel, chequea: https://github.com/fastapi/sqlmodel/issues/909

        entities = delete(Articles_Entities).where(col(Articles_Entities.id_article) == article_id)
        session.exec(entities) # type: ignore

        dictionary = delete(Articles_Dictionary).where(col(Articles_Dictionary.id_article) == article_id)
        session.exec(dictionary) # type: ignore

        type_word = delete(Articles_Types_Words).where(col(Articles_Types_Words.id_article) == article_id)
        session.exec(type_word) # type: ignore

        session.delete(article)

        session.commit()

    def get_article(self, article_id: int, session: SessionDep):
        article = session.get(Articles, article_id)

        if not article:
            raise HTTPException(status_code=404, detail="Artículo no encontrado")

        session.commit()

        article_object = {
            data_models.article_model["ID"]: article.id,
            data_models.article_model["name"]: article.article_name,
            data_models.article_model["summary"]: article.article_summary,
            data_models.article_model["dictionary"]: article.dictionary_of_words_item,
            data_models.article_model["type_words"]: article.types_words_item,
            data_models.article_model["entities"]: article.entities_item,
            data_models.article_model["note"]: article.note
        }

        return article_object
    
    def get_multiple_articles(self, offset: int, session: SessionDep):
        articles_list_not_processed = select(
            Articles.id,
            Articles.article_name,
            Articles.article_summary,
            Articles.creation_date
        ).offset(offset).limit(10)
        articles_list_not_processed = session.exec(articles_list_not_processed)

        articles_list_processed = []

        for article_id, article_name, article_summary, creation_date in articles_list_not_processed:
            articles_list_processed.append({
                data_models.article_model["ID"]: article_id,
                data_models.article_model["name"]:article_name,
                data_models.article_model["summary"]: article_summary,
                data_models.article_model["created_at"]: creation_date
            })

        return articles_list_processed
    
    def update_article(self, article_object: ArticlesUpdate, article_id: int, session: SessionDep):
        db_article = session.get(Articles, article_id)

        if not db_article:
            raise HTTPException(status_code=404, detail="Artículo para actualizar no encontrado")
        
        article_data = article_object.model_dump(exclude_unset=True)
        db_article.sqlmodel_update(article_data)
        session.add(db_article)
        session.commit()

articles_model = ArticlesModel()