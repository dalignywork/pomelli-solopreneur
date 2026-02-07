"""
Configuration centralisée de l'application.
Charge les variables d'environnement et fournit les constantes.
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Paramètres de l'application"""

    # IA
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "groq")  # "mistral" ou "groq"

    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    # Figma
    FIGMA_ACCESS_TOKEN: str = os.getenv("FIGMA_ACCESS_TOKEN", "")

    # Modèles IA par défaut
    MISTRAL_MODEL: str = "mistral-small-latest"
    GROQ_MODEL: str = "llama3-70b-8192"

    # Limites
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 Mo
    MAX_GENERATIONS_PER_REQUEST: int = 10
    MAX_SCRAPING_TIMEOUT: int = 10  # secondes

    # Templates LinkedIn
    LINKEDIN_POST_SIZE: tuple = (1200, 1200)
    LINKEDIN_CAROUSEL_SIZE: tuple = (1200, 1200)
    LINKEDIN_BANNER_SIZE: tuple = (1584, 396)
    INSTAGRAM_POST_SIZE: tuple = (1080, 1080)


settings = Settings()
