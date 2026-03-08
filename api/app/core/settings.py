from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_HOST: str = '0.0.0.0'
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"

    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7


settings = Settings()
