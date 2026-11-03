"""
Traveling Salesperson Problem (TSP) for Multiple Bombs
======================================================
Finds the optimal sequence to defuse all bombs in the facility:
Start -> Permutation of Bombs -> Exit.
Implemented with brute-force permutation evaluation for 3-5 bomb waypoints.
Computes exact pairwise grid shortest-path distances via Dijkstra / BFS.
"""

import itertools
import time
from typing import List, Tuple, Dict, Any, Optional
from algorithms.dijkstra import solve_dijkstra


def compute_pairwise_distances(
    grid: List[List[Any]],
    points: List[Tuple[int, int]]
) -> Dict[Tuple[int, int], Dict[str, Any]]:
    """
    Compute all-pairs shortest paths between waypoints.
    """
    dist_matrix = {}
    n = len(points)
    for i in range(n):
        for j in range(n):
            if i == j:
                dist_matrix[(i, j)] = {"cost": 0, "path": [[points[i][0], points[i][1]]]}
            else:
                res = solve_dijkstra(grid, points[i], points[j])
                dist_matrix[(i, j)] = {
                    "cost": res["cost"] if res["path"] else float("inf"),
                    "path": res["path"]
                }
    return dist_matrix


def solve_tsp(
    grid: Optional[List[List[Any]]],
    points: List[List[int]],
    labels: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Given:
      points[0] = Start
      points[1 .. N-2] = Bombs (A, B, C, ...)
      points[N-1] = Exit
    Evaluate all permutations of the bombs: Start -> [P] -> Exit.
    Returns:
      - route: concatenated grid coordinates of the optimal path
      - route_labels: sequence of names (e.g. ['START', 'BOMB B', 'BOMB A', 'BOMB C', 'EXIT'])
      - cost: total path weight
      - candidate_routes: all evaluated permutations and their costs
      - execution_time_ms: runtime
    """
    t_start = time.perf_counter()

    n = len(points)
    if n < 2:
        return {
            "route": points,
            "route_labels": labels or ["POINT"],
            "cost": 0,
            "candidate_routes": [],
            "execution_time_ms": 0.0
        }

    # Default labels: START, BOMB A, BOMB B, ..., EXIT
    if not labels or len(labels) != n:
        labels = ["START"]
        for i in range(1, n - 1):
            labels.append(f"BOMB {chr(64 + i)}")
        labels.append("EXIT")

    tuple_points = [(p[0], p[1]) for p in points]

    # If no grid provided, fallback to Manhattan distances
    if not grid:
        dummy_grid = [[1 for _ in range(30)] for _ in range(30)]
        dist_matrix = compute_pairwise_distances(dummy_grid, tuple_points)
    else:
        dist_matrix = compute_pairwise_distances(grid, tuple_points)

    start_idx = 0
    exit_idx = n - 1
    bomb_indices = list(range(1, n - 1))

    best_cost = float("inf")
    best_perm = None
    best_full_path = []
    candidate_routes = []

    # Try every permutation of bomb visit orders
    for perm in itertools.permutations(bomb_indices):
        full_order = (start_idx,) + perm + (exit_idx,)
        total_cost = 0
        path_segments = []
        possible = True

        for i in range(len(full_order) - 1):
            u, v = full_order[i], full_order[i + 1]
            seg_info = dist_matrix.get((u, v), {"cost": float("inf"), "path": []})
            if seg_info["cost"] == float("inf"):
                possible = False
                break
            total_cost += seg_info["cost"]

            # Merge paths (avoid duplicate junction points)
            seg_path = seg_info["path"]
            if i == 0:
                path_segments.extend(seg_path)
            else:
                path_segments.extend(seg_path[1:])

        if possible:
            candidate_labels = [labels[idx] for idx in full_order]
            candidate_routes.append({
                "order": candidate_labels,
                "path_coords": path_segments,
                "total_cost": total_cost
            })

            if total_cost < best_cost:
                best_cost = total_cost
                best_perm = full_order
                best_full_path = path_segments

    # Sort candidate routes by cost ascending
    candidate_routes.sort(key=lambda x: x["total_cost"])

    t_end = time.perf_counter()
    duration_ms = (t_end - t_start) * 1000

    best_labels = [labels[i] for i in best_perm] if best_perm else labels

    return {
        "route": best_full_path,
        "route_labels": best_labels,
        "cost": int(best_cost) if best_cost != float("inf") else 0,
        "candidate_routes": candidate_routes,
        "execution_time_ms": round(duration_ms, 3)
    }
