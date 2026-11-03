"""
Game Flow and Leaderboard Routes for Bomb Defusal Route.
"""

import os
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException

from models.schemas import (
    GameStartRequest, GameStartResponse, BombInfo,
    CompleteLevelRequest, CompleteLevelResponse,
    SaveResultRequest, LeaderboardEntry
)
from game.levels import get_level, LEVELS_CONFIG
from game.scoring import calculate_level_score
from algorithms.bfs import solve_bfs
from algorithms.dijkstra import solve_dijkstra
from algorithms.tsp import solve_tsp

router = APIRouter(prefix="/api", tags=["game"])

# In-memory leaderboard fallback
IN_MEMORY_LEADERBOARD: List[dict] = [
    {
        "id": "1",
        "username": "GhostAgent",
        "level": 3,
        "algorithm": "TSP",
        "score": 3480,
        "path_cost": 31,
        "time_taken": 84,
        "created_at": "2026-09-20 10:00:00"
    },
    {
        "id": "2",
        "username": "CyberDisposal",
        "level": 3,
        "algorithm": "TSP",
        "score": 3120,
        "path_cost": 35,
        "time_taken": 98,
        "created_at": "2026-09-20 09:30:00"
    },
    {
        "id": "3",
        "username": "AlgoMaster",
        "level": 2,
        "algorithm": "DIJKSTRA",
        "score": 2150,
        "path_cost": 17,
        "time_taken": 42,
        "created_at": "2026-09-20 08:45:00"
    },
    {
        "id": "4",
        "username": "TacticalDev",
        "level": 1,
        "algorithm": "BFS",
        "score": 1420,
        "path_cost": 14,
        "time_taken": 35,
        "created_at": "2026-09-20 08:00:00"
    }
]


@router.post("/game/start", response_model=GameStartResponse)
def start_game(req: GameStartRequest):
    lvl_data = get_level(req.level)
    session_id = f"session_{uuid.uuid4().hex[:8]}"

    bombs = [
        BombInfo(
            id=b["id"],
            row=b["row"],
            col=b["col"],
            label=b["label"],
            defused=False
        ) for b in lvl_data["bombs"]
    ]

    return GameStartResponse(
        session_id=session_id,
        level=lvl_data["level"],
        level_name=lvl_data["name"],
        algorithm=lvl_data["algorithm"],
        grid=lvl_data["grid"],
        player_start=lvl_data["player_start"],
        bombs=bombs,
        exit=lvl_data["exit"],
        time_limit_seconds=lvl_data["time_limit"],
        lives=3
    )


@router.post("/game/complete-level", response_model=CompleteLevelResponse)
def complete_level(req: CompleteLevelRequest):
    lvl_data = get_level(req.level)

    # Compute optimal cost
    optimal_cost = 0
    if req.level == 1:
        # BFS
        b_pos = (lvl_data["bombs"][0]["row"], lvl_data["bombs"][0]["col"])
        p_pos = (lvl_data["player_start"][0], lvl_data["player_start"][1])
        e_pos = (lvl_data["exit"][0], lvl_data["exit"][1])
        r1 = solve_bfs(lvl_data["grid"], p_pos, b_pos)
        r2 = solve_bfs(lvl_data["grid"], b_pos, e_pos)
        optimal_cost = r1["distance"] + r2["distance"]
    elif req.level == 2:
        # Dijkstra
        b_pos = (lvl_data["bombs"][0]["row"], lvl_data["bombs"][0]["col"])
        p_pos = (lvl_data["player_start"][0], lvl_data["player_start"][1])
        e_pos = (lvl_data["exit"][0], lvl_data["exit"][1])
        r1 = solve_dijkstra(lvl_data["grid"], p_pos, b_pos)
        r2 = solve_dijkstra(lvl_data["grid"], b_pos, e_pos)
        optimal_cost = r1["cost"] + r2["cost"]
    elif req.level == 3:
        # TSP
        points = [lvl_data["player_start"]] + [[b["row"], b["col"]] for b in lvl_data["bombs"]] + [lvl_data["exit"]]
        labels = ["START"] + [b["label"] for b in lvl_data["bombs"]] + ["EXIT"]
        tsp_res = solve_tsp(lvl_data["grid"], points, labels)
        optimal_cost = tsp_res["cost"]

    player_cost = req.route_cost if req.route_cost > 0 else optimal_cost
    difference = max(0, player_cost - optimal_cost)

    breakdown = calculate_level_score(
        level=req.level,
        time_remaining=req.time_remaining,
        lives_remaining=req.lives_remaining,
        bombs_defused=req.bombs_defused,
        total_bombs=req.total_bombs,
        route_cost=player_cost,
        optimal_cost=optimal_cost
    )

    next_lvl = req.level + 1 if req.level < len(LEVELS_CONFIG) else None

    return CompleteLevelResponse(
        success=req.bombs_defused == req.total_bombs,
        score_gained=breakdown["total_score"],
        score_breakdown=breakdown,
        optimal_cost=optimal_cost,
        player_cost=player_cost,
        difference=difference,
        next_level=next_lvl
    )


@router.post("/game/save-result")
def save_result(req: SaveResultRequest):
    entry = {
        "id": str(uuid.uuid4())[:8],
        "username": req.username or "Anonymous Agent",
        "level": req.level,
        "algorithm": req.algorithm,
        "score": req.score,
        "path_cost": req.path_cost,
        "time_taken": req.time_taken,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # If Supabase is configured
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            supabase = create_client(supabase_url, supabase_key)
            supabase.table("game_results").insert({
                "user_id": req.user_id,
                "username": req.username,
                "level": req.level,
                "algorithm": req.algorithm,
                "score": req.score,
                "path_cost": req.path_cost,
                "time_taken": req.time_taken,
                "nodes_explored": req.nodes_explored
            }).execute()
        except Exception:
            pass

    IN_MEMORY_LEADERBOARD.append(entry)
    IN_MEMORY_LEADERBOARD.sort(key=lambda x: x["score"], reverse=True)

    return {"status": "saved", "id": entry["id"]}


@router.get("/leaderboard")
def get_leaderboard(limit: int = 15):
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    if supabase_url and supabase_key:
        try:
            from supabase import create_client
            supabase = create_client(supabase_url, supabase_key)
            data = supabase.table("game_results").select("*").order("score", desc=True).limit(limit).execute()
            if data and data.data:
                return data.data
        except Exception:
            pass

    return IN_MEMORY_LEADERBOARD[:limit]
