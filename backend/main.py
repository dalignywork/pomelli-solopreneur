"""
Point d'entrée de l'API FastAPI.
Lance le serveur de backend pour Pomelli-Like.

Pour lancer : uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import brand, generate, templates

# Créer l'application FastAPI
app = FastAPI(
    title="Pomelli-Like API",
    description="API pour le générateur de personal branding IA",
    version="0.1.0",
    docs_url="/docs",       # Swagger UI : http://localhost:8000/docs
    redoc_url="/redoc",     # ReDoc : http://localhost:8000/redoc
)

# Configuration CORS (autoriser le frontend Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # Next.js en dev
        "https://*.vercel.app",        # Vercel en prod
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrer les routeurs
app.include_router(brand.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(templates.router, prefix="/api")


@app.get("/")
async def root():
    """Page d'accueil de l'API"""
    return {
        "app": "Pomelli-Like API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "brand": "/api/brand",
            "generate": "/api/generate",
            "templates": "/api/templates",
        },
    }


@app.get("/health")
async def health_check():
    """Vérification de santé de l'API"""
    from config import settings

    return {
        "status": "healthy",
        "ai_provider": settings.AI_PROVIDER,
        "has_ai_key": bool(
            settings.GROQ_API_KEY if settings.AI_PROVIDER == "groq"
            else settings.MISTRAL_API_KEY
        ),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
