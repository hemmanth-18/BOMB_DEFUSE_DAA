"""
Bomb Defusal Route — FastAPI Backend
======================================
Algorithms engine for Bomb Defusal Route:
- Manual BFS (Queue)
- Manual Dijkstra (Min-Heap)
- Manual TSP (Permutations & Shortest Tour)
- Dynamic Scoring & Leaderboard
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes.algorithm_routes import router as algo_router
from routes.game_routes import router as game_router

load_dotenv()

app = FastAPI(
    title="Bomb Defusal Route API",
    description="Algorithms engine for 2D Bomb Defusal Escape Game with BFS, Dijkstra, and TSP.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(algo_router)
app.include_router(game_router)


@app.get("/")
def root():
    return {
        "name": "Bomb Defusal Route API",
        "status": "online",
        "version": "1.0.0",
        "algorithms": ["BFS", "DIJKSTRA", "TSP"],
        "docs": "/docs"
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
