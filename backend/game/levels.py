"""
Facility Level Grids and Configurations for Bomb Defusal Route.
Enhanced for deep algorithmic tactical gameplay.
"""

from typing import Dict, Any, List


LEVELS_CONFIG: Dict[int, Dict[str, Any]] = {
    1: {
        "level": 1,
        "name": "Omega Sector Labyrinth",
        "algorithm": "BFS",
        "description": "Infiltrate the multi-branching security labyrinth. Avoid dead-end server vaults, defuse the primary warhead, and reach the extraction hatch. BFS guarantees minimum steps.",
        "time_limit": 100,
        "player_start": [1, 1],
        "exit": [10, 14],
        "bombs": [
            {"id": "bomb_1", "label": "WARHEAD 01", "row": 3, "col": 14, "defused": False}
        ],
        "patrols": [
            {"id": "sentry_1", "axis": "horizontal", "row": 5, "minCol": 5, "maxCol": 7, "col": 5, "direction": 1}
        ],
        # 12 rows x 16 columns
        "grid": [
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
            ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
            ["W", 1, "W", 1, "W", 1, "W", 1, "W", 1, "W","W","W", 1, "W","W"],
            ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
            ["W","W","W","W","W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W"],
            ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1, "W", 1, "W", 1,  1, "W"],
            ["W", 1, "W", 1, "W","W","W", 1, "W", 1, "W", 1, "W", 1, "W","W"],
            ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
            ["W", 1, "W","W","W", 1, "W","W","W","W","W", 1, "W","W", 1, "W"],
            ["W", 1,  1,  1, "W", 1,  1,  1,  1,  1, "W", 1, "W", 1,  1, "W"],
            ["W","W","W", 1,  1,  1, "W","W","W", 1,  1,  1, "W", 1,  1, "W"],
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
        ]
    },
    2: {
        "level": 2,
        "name": "Thermal Reactor Meltdown",
        "algorithm": "DIJKSTRA",
        "description": "Catastrophic core breach. Terrain hazards: Dangerous steam (3), High-Risk voltage (5), Critical radiation (8). Hazards cost health and massive energy. Dijkstra reveals the safest low-cost corridor.",
        "time_limit": 110,
        "player_start": [1, 1],
        "exit": [12, 1],
        "bombs": [
            {"id": "bomb_1", "label": "REACTOR CORE", "row": 9, "col": 16, "defused": False}
        ],
        "patrols": [
            {"id": "sentry_1", "axis": "horizontal", "row": 6, "minCol": 3, "maxCol": 7, "col": 3, "direction": 1},
            {"id": "sentry_2", "axis": "vertical", "col": 11, "minRow": 3, "maxRow": 6, "row": 3, "direction": 1}
        ],
        # 14 rows x 18 columns
        "grid": [
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
            ["W", 1,  1,  1, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
            ["W", 1, "W", 1, "W", 1, "W","W","W", 1, "W", 1, "W","W","W","W", 1, "W"],
            ["W", 1, "W", 1,  1,  1, "W", 8,  8,  1, "W", 1, "W", 3,  3,  1,  1, "W"],
            ["W", 3,  3,  3, "W", 1, "W", 8,  8,  1, "W", 1, "W", 3,  5,  5,  1, "W"],
            ["W", 5, "W", 3, "W", 1, "W","W","W", 1,  1,  1, "W", 1, "W", 8,  1, "W"],
            ["W", 5, "W", 1,  1,  1,  1,  1, "W", 1, "W", 1, "W", 1, "W", 8,  1, "W"],
            ["W", 8, "W","W","W","W","W", 1, "W", 1, "W", 1,  1,  1, "W", 5,  1, "W"],
            ["W", 8,  8,  8,  8,  5, "W", 1, "W", 1, "W","W","W", 1, "W", 3,  1, "W"],
            ["W", 1, "W","W","W", 3, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1, "W"],
            ["W", 1,  1,  1, "W", 1, "W","W","W","W","W", 1, "W","W","W","W", 1, "W"],
            ["W","W","W", 1, "W", 1,  1,  1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
            ["W", 1,  1,  1,  1,  1, "W","W","W", 1,  1,  1, "W", 1,  1, "W", 1, "W"],
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
        ]
    },
    3: {
        "level": 3,
        "name": "Blackout Vault — 4 Warheads",
        "algorithm": "TSP",
        "description": "High-security nuclear facility with 4 active tactical warheads armed in four separate wings. Formulate the optimal Traveling Salesperson route to defuse all 4 and extract before detonation.",
        "time_limit": 140,
        "player_start": [1, 1],
        "exit": [14, 18],
        "bombs": [
            {"id": "bomb_A", "label": "ALPHA", "row": 1, "col": 18, "defused": False},
            {"id": "bomb_B", "label": "BRAVO", "row": 14, "col": 1, "defused": False},
            {"id": "bomb_C", "label": "CHARLIE", "row": 7, "col": 9, "defused": False},
            {"id": "bomb_D", "label": "DELTA", "row": 13, "col": 18, "defused": False}
        ],
        "patrols": [
            {"id": "sentry_1", "axis": "horizontal", "row": 3, "minCol": 7, "maxCol": 10, "col": 7, "direction": 1},
            {"id": "sentry_2", "axis": "horizontal", "row": 9, "minCol": 5, "maxCol": 8, "col": 5, "direction": 1},
            {"id": "sentry_3", "axis": "vertical", "col": 13, "minRow": 1, "maxRow": 4, "row": 1, "direction": 1}
        ],
        # 16 rows x 20 columns
        "grid": [
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"],
            ["W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W"],
            ["W", 1, "W", 1, "W", 1, "W","W", 1, "W", 1, "W","W", 1, "W", 1, "W","W", 1, "W"],
            ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1, "W"],
            ["W","W","W","W","W", 1, "W", 1, "W","W","W","W", 1, "W","W","W","W", 1, "W","W"],
            ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1,  1,  1, "W"],
            ["W", 1, "W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W", 1, "W","W","W", 1, "W"],
            ["W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1,  1,  1, "W"],
            ["W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W","W","W", 1, "W", 1, "W"],
            ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W", 1, "W"],
            ["W","W","W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W", 1, "W", 1, "W"],
            ["W", 1,  1,  1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1, "W"],
            ["W", 1, "W","W","W", 1, "W","W","W", 1, "W","W","W", 1, "W", 1, "W","W","W","W"],
            ["W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1,  1,  1,  1,  1, "W"],
            ["W", 1,  1,  1, "W", 1, "W", 1,  1,  1, "W", 1,  1,  1, "W", 1,  1, "W", 1, "W"],
            ["W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W","W"]
        ]
    }
}


def get_level(level_id: int) -> Dict[str, Any]:
    return LEVELS_CONFIG.get(level_id, LEVELS_CONFIG[1])
