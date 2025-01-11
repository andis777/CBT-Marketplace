from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.config import settings
from api.routes import auth, users, psychologists, institutions, clients, articles
from api.db.base import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for CBT Marketplace platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(psychologists.router, prefix="/api/psychologists", tags=["Psychologists"])
app.include_router(institutions.router, prefix="/api/institutions", tags=["Institutions"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(articles.router, prefix="/api/articles", tags=["Articles"])

@app.get("/")
async def root():
    return {"message": "Welcome to CBT Marketplace API"}