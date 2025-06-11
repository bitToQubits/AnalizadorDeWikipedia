class Settings():
    API_V1_STR: str = "/api/v1"
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""
    OPENAI_API_KEY: str = ""
    WIKIPEDIA_API_URL: str = "https://en.wikipedia.org/w/api.php"

settings = Settings()  # type: ignore