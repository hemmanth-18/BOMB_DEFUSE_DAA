"""
DFS — Depth-First Search
=========================
Used for EXPLORATION / DISCOVERY mechanics.
Explores as deep as possible before backtracking.
Good for discovering connected areas and hidden locations.

Data structure used: Stack (explicit list, iterative)
Also provides recursive version for comparison.

Time complexity:  O(V + E)
Space complexity: O(V)

Algorithm Steps:
1. Push start node onto stack.
2. Pop a node; if unvisited, mark visited.
3. Push all unvisited neighbors onto stack.
4. Repeat until destination found or stack empty.
"""

from typing import Optional
from .graph import Graph


def dfs(graph: Graph, start: str, end: str) -> dict:
    """
    Run iterative DFS from start to end.

    Returns path + step-by-step visualization data.
    NOTE: DFS does NOT guarantee shortest path; it finds A path.

    Returns:
        {
            "path":           list of node ids,
            "cost":           total weight of the found path,
            "hops":           edge count,
            "nodes_explored": count,
            "visited_order":  list of nodes in exploration order,
            "steps":          step-by-step data for visualization,
            "found":          bool
        }
    """
    if start not in graph.adjacency or end not in graph.adjacency:
        return _not_found()

    if start == end:
        return {
            "path": [start], "cost": 0, "hops": 0,
            "nodes_explored": 1, "visited_order": [start], "steps": [], "found": True
        }

    # DFS state — stack contains (node, path_so_far)
    stack: list[tuple[str, list[str]]] = [(start, [start])]
    visited: set[str] = set()
    visited_order: list[str] = []
    steps = []
    step_num = 0

    while stack:
        current, path_so_far = stack.pop()

        if current in visited:
            continue

        visited.add(current)
        visited_order.append(current)

        steps.append({
            "step":         step_num,
            "action":       "visit",
            "current":      current,
            "path_so_far":  list(path_so_far),
            "stack_size":   len(stack),
            "visited":      list(visited),
        })
        step_num += 1

        if current == end:
            cost = _calculate_cost(graph, path_so_far)
            return {
                "path":           path_so_far,
                "cost":           cost,
                "hops":           len(path_so_far) - 1,
                "nodes_explored": len(visited),
                "visited_order":  visited_order,
                "steps":          steps,
                "found":          True,
            }

        # Push neighbors onto stack (reverse order for natural traversal)
        neighbors = graph.get_neighbors(current)
        for neighbor, weight, road_type in reversed(neighbors):
            if neighbor not in visited:
                steps.append({
                    "step":      step_num,
                    "action":    "push",
                    "current":   current,
                    "neighbor":  neighbor,
                    "weight":    weight,
                    "road_type": road_type,
                    "visited":   list(visited),
                })
                step_num += 1
                stack.append((neighbor, path_so_far + [neighbor]))

    return _not_found()


def dfs_explore(graph: Graph, start: str, max_depth: int = 6) -> dict:
    """
    DFS exploration from a start node up to max_depth.
    Used for the 'discover unexplored areas' game mechanic.
    Returns all reachable nodes within depth limit.
    """
    visited: dict[str, int] = {}  # node → depth discovered
    stack = [(start, 0, [start])]
    exploration_order = []
    steps = []
    step_num = 0

    while stack:
        current, depth, path = stack.pop()
        if current in visited or depth > max_depth:
            continue

        visited[current] = depth
        exploration_order.append({"node": current, "depth": depth})

        steps.append({
            "step":    step_num,
            "action":  "discover",
            "current": current,
            "depth":   depth,
        })
        step_num += 1

        for neighbor, weight, road_type in graph.get_neighbors(current):
            if neighbor not in visited:
                stack.append((neighbor, depth + 1, path + [neighbor]))

    return {
        "discovered_nodes": [e["node"] for e in exploration_order],
        "exploration_order": exploration_order,
        "steps": steps,
        "total_discovered": len(visited),
    }


def _calculate_cost(graph: Graph, path: list) -> float:
    total = 0.0
    for i in range(len(path) - 1):
        neighbors = {n: w for n, w, _ in graph.get_neighbors(path[i])}
        total += neighbors.get(path[i + 1], 0)
    return total


def _not_found() -> dict:
    return {
        "path": [], "cost": 0, "hops": 0,
        "nodes_explored": 0, "visited_order": [],
        "steps": [], "found": False,
    }
