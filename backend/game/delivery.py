"""
Delivery generation system.
Generates delivery orders per level with appropriate difficulty.
"""

import random
import uuid
from typing import List
from algorithms.graph import NODES

# ---------------------------------------------------------------------------
# Delivery destination pools per level
# ---------------------------------------------------------------------------
LEVEL_CONFIGS = {
    1: {
        "name": "City Explorer",
        "description": "Learn the city. One delivery to get you started.",
        "delivery_count": 1,
        "time_limit": 120,
        "fuel_capacity": 100.0,
        "traffic_level": "normal",
        "recommended_algorithm": "dijkstra",
        "available_algorithms": ["bfs", "dfs", "dijkstra"],
        "destinations": ["hospital", "college"],
        "reward_range": (200, 300),
    },
    2: {
        "name": "Route Challenge",
        "description": "Compare routing algorithms. Pick your path wisely.",
        "delivery_count": 2,
        "time_limit": 150,
        "fuel_capacity": 100.0,
        "traffic_level": "normal",
        "recommended_algorithm": "dijkstra",
        "available_algorithms": ["bfs", "dfs", "dijkstra"],
        "destinations": ["hospital", "college", "supermarket", "restaurant"],
        "reward_range": (250, 350),
    },
    3: {
        "name": "Traffic Rush",
        "description": "Roads have real costs. Dijkstra will save your fuel!",
        "delivery_count": 3,
        "time_limit": 180,
        "fuel_capacity": 80.0,
        "traffic_level": "moderate",
        "recommended_algorithm": "dijkstra",
        "available_algorithms": ["bfs", "dfs", "dijkstra"],
        "destinations": ["hospital", "college", "supermarket", "restaurant", "office", "hotel"],
        "reward_range": (300, 450),
    },
    4: {
        "name": "Multiple Deliveries",
        "description": "Four packages. Heavy traffic. Beat the clock!",
        "delivery_count": 4,
        "time_limit": 240,
        "fuel_capacity": 70.0,
        "traffic_level": "heavy",
        "recommended_algorithm": "dijkstra",
        "available_algorithms": ["bfs", "dfs", "dijkstra"],
        "destinations": ["hospital", "college", "supermarket", "restaurant", "office", "hotel", "delivery_hub"],
        "reward_range": (350, 500),
    },
}


def generate_deliveries(level: int) -> List[dict]:
    """Generate delivery orders for a given level."""
    config = LEVEL_CONFIGS.get(level, LEVEL_CONFIGS[1])
    destinations = config["destinations"].copy()
    random.shuffle(destinations)

    count = config["delivery_count"]
    selected = destinations[:count]

    deliveries = []
    for i, dest in enumerate(selected):
        dest_node = NODES.get(dest, {})
        reward = random.randint(*config["reward_range"])
        deliveries.append({
            "id":                   str(uuid.uuid4()),
            "package_number":       1000 + random.randint(10, 99),
            "source":               "warehouse",
            "source_label":         "Techville Warehouse",
            "destination":          dest,
            "destination_label":    dest_node.get("label", dest),
            "destination_icon":     dest_node.get("icon", "📦"),
            "reward_coins":         reward,
            "time_limit_seconds":   config["time_limit"],
            "difficulty":           config["traffic_level"],
        })

    return deliveries


def get_level_config(level: int) -> dict:
    return LEVEL_CONFIGS.get(level, LEVEL_CONFIGS[1])
