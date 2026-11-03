"""
TECHVILLE City Graph
====================
Represents the fictional city as a weighted directed/undirected graph.
Nodes = junctions, locations
Edges = roads with weights (distance + traffic cost)

Road Cost Legend:
  Normal Road    = 1
  Busy Road      = 3
  Heavy Traffic  = 5
  Damaged Road   = 8
  Blocked Road   = math.inf (removed from graph)
"""

import math
from typing import Dict, List, Tuple, Optional

# ---------------------------------------------------------------------------
# Node definitions — (id, label, type, x, y)   (x,y used for 3D placement)
# ---------------------------------------------------------------------------
NODES: Dict[str, dict] = {
    # --- Major Landmarks ---
    "warehouse":      {"label": "Techville Warehouse",  "type": "warehouse",      "x": 0,    "y": 0,    "icon": "warehouse"},
    "hospital":       {"label": "Techville Hospital",   "type": "hospital",       "x": -4,   "y": 6,    "icon": "hospital"},
    "college":        {"label": "Techville College",    "type": "college",        "x": 5,    "y": 8,    "icon": "college"},
    "supermarket":    {"label": "Techville Supermarket","type": "supermarket",    "x": 7,    "y": -2,   "icon": "supermarket"},
    "restaurant":     {"label": "Tasty Restaurant",     "type": "restaurant",     "x": -6,   "y": -3,   "icon": "restaurant"},
    "office":         {"label": "City Office Block",    "type": "office",         "x": 2,    "y": 4,    "icon": "office"},
    "hotel":          {"label": "Grand Hotel",          "type": "hotel",          "x": -3,   "y": 1,    "icon": "hotel"},
    "delivery_hub":   {"label": "Delivery Hub East",    "type": "delivery_hub",   "x": 9,    "y": 3,    "icon": "delivery_hub"},
    "fuel_station_1": {"label": "FuelStop Central",     "type": "fuel_station",   "x": 1,    "y": -2,   "icon": "fuel_station"},
    "fuel_station_2": {"label": "FuelStop North",       "type": "fuel_station",   "x": 0,    "y": 5,    "icon": "fuel_station"},
    "fuel_station_3": {"label": "FuelStop East",        "type": "fuel_station",   "x": 6,    "y": 1,    "icon": "fuel_station"},

    # --- Junctions / Intersections ---
    "j01": {"label": "Junction 01", "type": "junction", "x": 0,   "y": 2,   "icon": "⬡"},
    "j02": {"label": "Junction 02", "type": "junction", "x": -2,  "y": 2,   "icon": "⬡"},
    "j03": {"label": "Junction 03", "type": "junction", "x": 2,   "y": 2,   "icon": "⬡"},
    "j04": {"label": "Junction 04", "type": "junction", "x": 0,   "y": -1,  "icon": "⬡"},
    "j05": {"label": "Junction 05", "type": "junction", "x": -2,  "y": -1,  "icon": "⬡"},
    "j06": {"label": "Junction 06", "type": "junction", "x": 2,   "y": -1,  "icon": "⬡"},
    "j07": {"label": "Junction 07", "type": "junction", "x": -4,  "y": 2,   "icon": "⬡"},
    "j08": {"label": "Junction 08", "type": "junction", "x": -4,  "y": -1,  "icon": "⬡"},
    "j09": {"label": "Junction 09", "type": "junction", "x": 4,   "y": 2,   "icon": "⬡"},
    "j10": {"label": "Junction 10", "type": "junction", "x": 4,   "y": -1,  "icon": "⬡"},
    "j11": {"label": "Junction 11", "type": "junction", "x": -2,  "y": 4,   "icon": "⬡"},
    "j12": {"label": "Junction 12", "type": "junction", "x": 2,   "y": 4,   "icon": "⬡"},
    "j13": {"label": "Junction 13", "type": "junction", "x": -4,  "y": 4,   "icon": "⬡"},
    "j14": {"label": "Junction 14", "type": "junction", "x": 4,   "y": 4,   "icon": "⬡"},
    "j15": {"label": "Junction 15", "type": "junction", "x": 0,   "y": 6,   "icon": "⬡"},
    "j16": {"label": "Junction 16", "type": "junction", "x": -2,  "y": 6,   "icon": "⬡"},
    "j17": {"label": "Junction 17", "type": "junction", "x": 2,   "y": 6,   "icon": "⬡"},
    "j18": {"label": "Junction 18", "type": "junction", "x": 6,   "y": 4,   "icon": "⬡"},
    "j19": {"label": "Junction 19", "type": "junction", "x": 6,   "y": -1,  "icon": "⬡"},
    "j20": {"label": "Junction 20", "type": "junction", "x": 8,   "y": 2,   "icon": "⬡"},
    "j21": {"label": "Junction 21", "type": "junction", "x": -6,  "y": -1,  "icon": "⬡"},
    "j22": {"label": "Junction 22", "type": "junction", "x": -6,  "y": 2,   "icon": "⬡"},
    "j23": {"label": "Junction 23", "type": "junction", "x": 3,   "y": 7,   "icon": "⬡"},
    "j24": {"label": "Junction 24", "type": "junction", "x": 7,   "y": 6,   "icon": "⬡"},
    "j25": {"label": "Junction 25", "type": "junction", "x": -5,  "y": 5,   "icon": "⬡"},
}

# ---------------------------------------------------------------------------
# Edge definitions — (from, to, weight, road_type)
# road_type: "normal"|"busy"|"heavy"|"damaged"|"blocked"
# All edges are bidirectional (added in both directions)
# ---------------------------------------------------------------------------
EDGES_RAW: List[Tuple[str, str, float, str]] = [
    # Warehouse hub connections
    ("warehouse",      "j01",           2,  "normal"),
    ("warehouse",      "j04",           1,  "normal"),
    ("warehouse",      "hotel",         3,  "busy"),
    ("warehouse",      "fuel_station_1",2,  "normal"),

    # Central grid
    ("j01",            "j02",           1,  "normal"),
    ("j01",            "j03",           1,  "normal"),
    ("j01",            "fuel_station_2",3,  "busy"),
    ("j02",            "j11",           2,  "normal"),
    ("j02",            "j07",           2,  "normal"),
    ("j02",            "hotel",         2,  "normal"),
    ("j03",            "j12",           2,  "normal"),
    ("j03",            "j09",           2,  "normal"),
    ("j03",            "office",        2,  "normal"),
    ("j04",            "j05",           1,  "normal"),
    ("j04",            "j06",           1,  "normal"),
    ("j05",            "j08",           2,  "normal"),
    ("j05",            "restaurant",    4,  "busy"),
    ("j06",            "j10",           2,  "normal"),
    ("j06",            "fuel_station_1",1,  "normal"),
    ("j06",            "supermarket",   5,  "heavy"),
    ("j07",            "j08",           1,  "normal"),
    ("j07",            "j13",           2,  "busy"),
    ("j08",            "j21",           3,  "busy"),
    ("j08",            "restaurant",    4,  "heavy"),
    ("j09",            "j10",           1,  "normal"),
    ("j09",            "j14",           2,  "normal"),
    ("j09",            "fuel_station_3",2,  "normal"),
    ("j10",            "j19",           3,  "busy"),
    ("j10",            "fuel_station_3",1,  "normal"),
    ("j11",            "j12",           1,  "normal"),
    ("j11",            "j13",           2,  "normal"),
    ("j11",            "fuel_station_2",2,  "normal"),
    ("j12",            "j14",           2,  "normal"),
    ("j12",            "j17",           2,  "busy"),
    ("j12",            "office",        1,  "normal"),
    ("j13",            "j25",           3,  "busy"),
    ("j13",            "hospital",      5,  "heavy"),
    ("j14",            "j18",           2,  "normal"),
    ("j14",            "j23",           3,  "busy"),
    ("j15",            "j16",           1,  "normal"),
    ("j15",            "j17",           1,  "normal"),
    ("j15",            "hospital",      3,  "busy"),
    ("j15",            "fuel_station_2",2,  "normal"),
    ("j16",            "j25",           2,  "normal"),
    ("j16",            "hospital",      2,  "normal"),
    ("j17",            "j23",           2,  "normal"),
    ("j17",            "college",       4,  "busy"),
    ("j18",            "j20",           3,  "normal"),
    ("j18",            "j24",           3,  "busy"),
    ("j18",            "delivery_hub",  4,  "normal"),
    ("j19",            "j20",           2,  "normal"),
    ("j19",            "supermarket",   3,  "busy"),
    ("j19",            "fuel_station_3",2,  "normal"),
    ("j20",            "delivery_hub",  2,  "normal"),
    ("j20",            "j24",           3,  "busy"),
    ("j21",            "j22",           2,  "normal"),
    ("j21",            "restaurant",    3,  "busy"),
    ("j22",            "hotel",         4,  "damaged"),
    ("j22",            "j25",           5,  "heavy"),
    ("j23",            "college",       3,  "normal"),
    ("j23",            "j24",           4,  "busy"),
    ("j24",            "college",       4,  "heavy"),
    ("j24",            "delivery_hub",  3,  "normal"),
    ("j25",            "hospital",      4,  "busy"),
    ("fuel_station_2", "j11",           1,  "normal"),
    ("fuel_station_3", "supermarket",   3,  "busy"),
    ("office",         "j12",           1,  "normal"),
    ("hotel",          "j02",           2,  "normal"),
    ("hotel",          "j07",           3,  "busy"),
]

# Road type → base weight multiplier (applied on top of raw weight)
ROAD_TYPE_WEIGHTS = {
    "normal":  1,
    "busy":    1,   # weight already encoded in EDGES_RAW
    "heavy":   1,
    "damaged": 1,
    "blocked": math.inf,
}

# ---------------------------------------------------------------------------
# Graph class — Adjacency List representation
# ---------------------------------------------------------------------------
class Graph:
    def __init__(self):
        self.adjacency: Dict[str, List[Tuple[str, float, str]]] = {}
        self._build()

    def _build(self):
        """Build the adjacency list from EDGES_RAW (bidirectional)."""
        # Initialize all nodes
        for node_id in NODES:
            self.adjacency[node_id] = []

        for src, dst, weight, road_type in EDGES_RAW:
            if weight == math.inf:
                continue  # blocked roads: skip
            self.adjacency[src].append((dst, weight, road_type))
            self.adjacency[dst].append((src, weight, road_type))

    def get_neighbors(self, node: str) -> List[Tuple[str, float, str]]:
        """Return list of (neighbor_id, weight, road_type)."""
        return self.adjacency.get(node, [])

    def get_all_nodes(self) -> List[str]:
        return list(self.adjacency.keys())

    def get_node_info(self, node_id: str) -> Optional[dict]:
        return NODES.get(node_id)

    def get_nodes_data(self) -> Dict[str, dict]:
        return NODES

    def get_edges_data(self) -> List[dict]:
        seen = set()
        edges = []
        for src, dst, weight, road_type in EDGES_RAW:
            key = tuple(sorted([src, dst]))
            if key not in seen:
                seen.add(key)
                edges.append({
                    "from": src,
                    "to":   dst,
                    "weight": weight,
                    "road_type": road_type
                })
        return edges

    def apply_traffic_modifiers(self, modifiers: Dict[str, float]):
        """
        Temporarily adjust edge weights based on traffic conditions.
        modifiers = {road_type: multiplier}
        Rebuilds the adjacency list with new weights.
        """
        for node_id in NODES:
            self.adjacency[node_id] = []

        for src, dst, weight, road_type in EDGES_RAW:
            multiplier = modifiers.get(road_type, 1.0)
            new_weight = weight * multiplier
            if new_weight == math.inf:
                continue
            self.adjacency[src].append((dst, new_weight, road_type))
            self.adjacency[dst].append((src, new_weight, road_type))


# Singleton graph instance
_graph_instance: Optional[Graph] = None

def get_graph() -> Graph:
    global _graph_instance
    if _graph_instance is None:
        _graph_instance = Graph()
    return _graph_instance
