"""
Algorithm API Routes: BFS, Dijkstra, and TSP.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import (
    BFSRequest, BFSResponse,
    DijkstraRequest, DijkstraResponse,
    TSPRequest, TSPResponse
)
from algorithms.bfs import solve_bfs
from algorithms.dijkstra import solve_dijkstra
from algorithms.tsp import solve_tsp

router = APIRouter(prefix="/api", tags=["algorithms"])


@router.post("/bfs", response_model=BFSResponse)
def run_bfs(req: BFSRequest):
    try:
        start_t = (req.start[0], req.start[1])
        target_t = (req.target[0], req.target[1])
        res = solve_bfs(req.grid, start_t, target_t)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BFS failed: {str(e)}")


@router.post("/dijkstra", response_model=DijkstraResponse)
def run_dijkstra(req: DijkstraRequest):
    try:
        start_t = (req.start[0], req.start[1])
        target_t = (req.target[0], req.target[1])
        res = solve_dijkstra(req.grid, start_t, target_t)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dijkstra failed: {str(e)}")


@router.post("/tsp", response_model=TSPResponse)
def run_tsp(req: TSPRequest):
    try:
        res = solve_tsp(req.grid, req.points, req.labels)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TSP failed: {str(e)}")
