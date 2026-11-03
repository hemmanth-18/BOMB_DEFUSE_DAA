"""
Leaderboard API Routes
=======================
GET  /api/leaderboard
POST /api/leaderboard/submit
"""

import os
from fastapi import APIRouter, HTTPException
from models.schemas import LeaderboardResponse, LeaderboardEntry, SubmitScoreRequest

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

# In-memory fallback leaderboard (used when Supabase is not configured)
_mock_leaderboard = [
    {"rank": 1, "username": "DriveKing",    "score": 9850, "level": 4, "algorithm": "dijkstra", "deliveries": 16},
    {"rank": 2, "username": "RouteHero",    "score": 9210, "level": 4, "algorithm": "dijkstra", "deliveries": 15},
    {"rank": 3, "username": "Hemmanth",     "score": 8940, "level": 4, "algorithm": "dijkstra", "deliveries": 14},
    {"rank": 4, "username": "Alex",         "score": 8510, "level": 3, "algorithm": "bfs",      "deliveries": 13},
    {"rank": 5, "username": "Rider99",      "score": 8230, "level": 3, "algorithm": "dijkstra", "deliveries": 12},
    {"rank": 6, "username": "CityRacer",    "score": 7800, "level": 3, "algorithm": "dfs",      "deliveries": 11},
    {"rank": 7, "username": "GraphMaster",  "score": 7400, "level": 2, "algorithm": "dijkstra", "deliveries": 10},
    {"rank": 8, "username": "QuickDrop",    "score": 6950, "level": 2, "algorithm": "bfs",      "deliveries": 9},
    {"rank": 9, "username": "NightDriver",  "score": 6500, "level": 2, "algorithm": "dijkstra", "deliveries": 8},
    {"rank": 10,"username": "NewPlayer",    "score": 5200, "level": 1, "algorithm": "bfs",      "deliveries": 6},
]


def _get_supabase_client():
    """Try to get Supabase client; return None if not configured."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    try:
        from supabase import create_client
        return create_client(url, key)
    except Exception:
        return None


@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(limit: int = 10):
    """
    Fetch top leaderboard entries.
    Uses Supabase if configured, otherwise returns mock data.
    """
    supabase = _get_supabase_client()

    if supabase:
        try:
            result = (
                supabase.table("leaderboard_view")
                .select("*")
                .order("score", desc=True)
                .limit(limit)
                .execute()
            )
            entries = []
            for i, row in enumerate(result.data or []):
                entries.append(LeaderboardEntry(
                    rank=i + 1,
                    username=row.get("username", "Unknown"),
                    score=row.get("score", 0),
                    level=row.get("level", 1),
                    algorithm=row.get("algorithm", "dijkstra"),
                    deliveries=row.get("deliveries_completed"),
                    created_at=str(row.get("created_at", "")),
                ))
            return LeaderboardResponse(entries=entries, total=len(entries))
        except Exception as e:
            # Fall through to mock data
            pass

    # Mock leaderboard
    entries = [LeaderboardEntry(**row) for row in _mock_leaderboard[:limit]]
    return LeaderboardResponse(entries=entries, total=len(_mock_leaderboard))


@router.post("/submit")
def submit_score(req: SubmitScoreRequest):
    """Submit a game score to the leaderboard."""
    supabase = _get_supabase_client()

    if supabase:
        try:
            supabase.table("games").insert({
                "user_id":       req.user_id,
                "level":         req.level,
                "score":         req.score,
                "algorithm":     req.algorithm,
                "route_cost":    req.route_cost,
                "distance":      req.distance,
                "nodes_explored":req.nodes_explored,
                "time_taken":    req.time_taken,
            }).execute()
            return {"success": True, "message": "Score saved to leaderboard"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save score: {str(e)}")

    # Mock success when Supabase not configured
    return {"success": True, "message": "Score recorded (demo mode — Supabase not configured)"}
