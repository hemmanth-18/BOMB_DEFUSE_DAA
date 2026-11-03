"""
Scoring and Evaluation Engine for Bomb Defusal Route.
Calculates dynamic scores based on gameplay metrics, time, and algorithmic optimality.
"""

from typing import Dict, Any


def calculate_level_score(
    level: int,
    time_remaining: int,
    lives_remaining: int,
    bombs_defused: int,
    total_bombs: int,
    route_cost: int = 0,
    optimal_cost: int = 0
) -> Dict[str, Any]:
    """
    Calculate dynamic score:
      - Base bomb reward: +500 per defused bomb
      - Successful Escape bonus: +300
      - Time bonus: +10 per remaining second
      - Life bonus: +100 per remaining life
      - Route efficiency bonus: up to +200 if route is near optimal
    """
    base_bomb_reward = bombs_defused * 500
    escape_bonus = 300 if bombs_defused == total_bombs else 0
    time_bonus = max(0, time_remaining * 10)
    life_bonus = max(0, lives_remaining * 100)

    # Efficiency bonus
    efficiency_bonus = 0
    if route_cost > 0 and optimal_cost > 0:
        ratio = optimal_cost / max(1, route_cost)
        if ratio >= 0.95:
            efficiency_bonus = 200
        elif ratio >= 0.8:
            efficiency_bonus = 100
        elif ratio >= 0.6:
            efficiency_bonus = 50
    elif bombs_defused == total_bombs:
        efficiency_bonus = 100

    hazard_penalty = max(0, (3 - lives_remaining) * 50)

    total_score = max(
        0,
        base_bomb_reward + escape_bonus + time_bonus + life_bonus + efficiency_bonus - hazard_penalty
    )

    return {
        "base_bomb_reward": base_bomb_reward + escape_bonus,
        "time_bonus": time_bonus,
        "efficiency_bonus": efficiency_bonus,
        "life_bonus": life_bonus,
        "hazard_penalty": hazard_penalty,
        "total_score": total_score
    }
