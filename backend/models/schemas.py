"""
Pydantic schemas for Bomb Defusal Route.
"""

from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field


# ── Grid Algorithms ────────────────────────────────────────────────────────
class BFSRequest(BaseModel):
    grid: List[List[Union[int, str, Dict[str, Any]]]]
    start: List[int] = Field(..., description="[row, col]")
    target: List[int] = Field(..., description="[row, col]")


class BFSResponse(BaseModel):
    path: List[List[int]]
    visited: List[List[int]]
    distance: int
    nodes_explored: int
    execution_time_ms: float = 0.0


class DijkstraRequest(BaseModel):
    grid: List[List[Union[int, str, Dict[str, Any]]]]
    start: List[int] = Field(..., description="[row, col]")
    target: List[int] = Field(..., description="[row, col]")


class DijkstraResponse(BaseModel):
    path: List[List[int]]
    visited: List[List[int]]
    cost: int
    nodes_explored: int
    execution_time_ms: float = 0.0


class TSPRequest(BaseModel):
    points: List[List[int]] = Field(..., description="List of [row, col] coordinates: [Start, BombA, BombB, ..., Exit]")
    grid: Optional[List[List[Union[int, str, Dict[str, Any]]]]] = None
    labels: Optional[List[str]] = None


class CandidateRoute(BaseModel):
    order: List[str]
    path_coords: List[List[int]]
    total_cost: int


class TSPResponse(BaseModel):
    route: List[List[int]]
    route_labels: List[str]
    cost: int
    candidate_routes: List[CandidateRoute] = []
    execution_time_ms: float = 0.0


# ── Game Flow ──────────────────────────────────────────────────────────────
class GameStartRequest(BaseModel):
    level: int = 1
    user_id: Optional[str] = None


class BombInfo(BaseModel):
    id: str
    row: int
    col: int
    label: str
    defused: bool = False


class GameStartResponse(BaseModel):
    session_id: str
    level: int
    level_name: str
    algorithm: str
    grid: List[List[Union[int, str]]]
    player_start: List[int]
    bombs: List[BombInfo]
    exit: List[int]
    time_limit_seconds: int
    lives: int = 3


class CompleteLevelRequest(BaseModel):
    level: int
    time_remaining: int
    lives_remaining: int
    bombs_defused: int
    total_bombs: int
    algorithm_used: str
    route_cost: int = 0
    player_bomb_order: Optional[List[str]] = None
    optimal_bomb_order: Optional[List[str]] = None
    user_id: Optional[str] = None
    username: Optional[str] = None


class ScoreBreakdown(BaseModel):
    base_bomb_reward: int
    time_bonus: int
    efficiency_bonus: int
    life_bonus: int
    hazard_penalty: int
    total_score: int


class CompleteLevelResponse(BaseModel):
    success: bool
    score_gained: int
    score_breakdown: ScoreBreakdown
    optimal_cost: Optional[int] = None
    player_cost: Optional[int] = None
    difference: Optional[int] = None
    next_level: Optional[int] = None


class SaveResultRequest(BaseModel):
    user_id: Optional[str] = "guest"
    username: Optional[str] = "Agent"
    level: int
    algorithm: str
    score: int
    path_cost: int
    time_taken: int
    nodes_explored: int


class LeaderboardEntry(BaseModel):
    id: str
    username: str
    level: int
    algorithm: str
    score: int
    path_cost: int
    time_taken: int
    created_at: str
