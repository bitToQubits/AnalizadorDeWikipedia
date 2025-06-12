from layers.models.v1.db_handler import SessionDep
from sqlmodel import Field, SQLModel

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
    word: str
    type_word: str

class Article_Types_Words(ArticlesTypesWordsBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ArticlesEntitiesBase(SQLModel):
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
            type_word_object = ArticlesTypesWordsBase(word=type_word_array[0], type_word=type_word_array[1])
            self.save_article_types_words(type_word_object, session)

        for entity in article_object.entities:
            entity_object = ArticlesEntitiesBase(word=entity[0], entity=entity[1])
            self.save_article_entities(entity_object, session)

        session.commit()

    def delete_article(self, article_id: int, session: SessionDep):
        article = session.get(Articles, article_id)
        session.delete(article)
        entities = session.get(Articles_Entities, article_id)


articles_model = ArticlesModel()