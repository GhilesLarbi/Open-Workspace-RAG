from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_HOST: str = '0.0.0.0'
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"


settings = Settings()
