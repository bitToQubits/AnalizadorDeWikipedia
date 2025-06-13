import os
from dotenv import load_dotenv
from spacy.language import Language

load_dotenv()

class Settings():
    def __init__(self):
        self.API_V1_STR: str = "/api/v1"
        self.POSTGRES_URL: str = "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_SERVER"),
            port=os.getenv("POSTGRES_PORT"),
            database=os.getenv("POSTGRES_DB")
        )
        self.model_for_recognizing_language: Language
        self.WIKIPEDIA_API_URL: str = "https://es.wikipedia.org/w/api.php"
        self.STOP_WORDS: set = set([
            "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "por", "un", "para", "con", "no", "una", "su", "al", "lo",
            "como", "más", "pero", "sus", "le", "ya", "o", "este", "sí", "porque", "esta", "entre", "cuando", "muy", "sin", "sobre", "también",
            "me", "hasta", "hay", "donde", "quien", "desde", "todo", "esto", "nos", "poco", "mi", "tener", "haciendo", "hace", "hacer", "todo",
            "él", "ella", "ellos", "ellas", "usted", "ustedes", "vosotros", "vosotras", "mío", "mía", "míos", "mías", "tuyo", "tuya", "tuyos",
            "tuyas", "suyo", "suya", "suyos", "suyas", "nuestro", "nuestra", "nuestros", "nuestras", "vuestro", "vuestra", "vuestros", "vuestras",
            "ese", "esa", "esos", "esas", "aquí", "allí", "así", "tal", "varios", "varias", "mucho", "muchos", "mucha", "muchas", "cuanto",
            "cuantos", "cuanta", "cuantas", "poco", "pocos", "poca", "pocas", "demasiado", "demasiados", "demasiada", "demasiadas", "cada",
            "misma", "mismo", "mismos", "mismas", "otro", "otra", "otros", "otras", "ser", "estar", "ir", "haber", "tener", "poder", "saber",
            "querer", "deber", "decir", "hablar", "ver", "dar", "venir", "ir", "hacer", "parecer", "resultar", "seguir", "encontrar", "colocar",
            "utilizar", "conseguir", "emplear", "lograr", "mencionar", "observar", "explicar", "considerar", "presentar", "demostrar", "indicar",
            "mostrar", "señalar", "desarrollar", "realizar", "llevar", "acabar", "terminar", "comenzar", "empezar", "continuar", "volver", "quedar",
            "ocurrir", "suceder", "apenas", "quizá", "quizás", "acaso", "pronto", "tarde", "siempre", "nunca", "jamás", "hoy", "ayer", "mañana",
            "bien", "mal", "mejor", "peor", "casi", "además", "entonces", "luego", "después", "durante", "mediante", "junto", "según", "respecto",
            "excepto", "salvo", "incluso", "sino", "aunque", "mientras", "apenas", "tan", "tanto", "antes", "después", "arriba", "abajo", "dentro",
            "fuera", "delante", "detrás", "encima", "debajo", "cerca", "lejos", "junto", "frente", "enfrente", "contra", "hacia", "hasta", "mediante",
            "para", "por", "según", "sin", "sobre", "tras", "durante", "vía"
        ])

settings = Settings()