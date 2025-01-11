from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    # API settings
    PROJECT_NAME: str = "CBT Marketplace API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "development_secret_key"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./cbt_marketplace.db"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()