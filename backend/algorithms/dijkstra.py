"""
Dijkstra's Algorithm for Weighted 2D Grid
==========================================
Implemented manually using heapq priority queue (min-heap).
Finds the minimum-cost path through weighted terrain cells:
  Normal      = 1
  Dangerous   = 3
  High Risk   = 5
  Critical    = 8
  Wall        = blocked (inf)
"""

import heapq
import time
from typing import List, Tuple, Dict, Any, Union


def get_cell_cost(cell: Union[int, str, dict]) -> float:
    """Extract traversal cost of a cell."""
    if isinstance(cell, dict):
        if cell.get("type") == "wall":
            return float("inf")
        return float(cell.get("cost", 1))

    if isinstance(cell, str):
        c = cell.lower()
        if c in ("wall", "w", "#", "blocked"):
            return float("inf")
        if c == "dangerous":
            return 3.0
        if c == "high_risk":
            return 5.0
        if c == "critical":
            return 8.0
        try:
            return float(c)
        except ValueError:
            return 1.0

    if isinstance(cell, (int, float)):
        return float("inf") if cell < 0 else float(cell)

    return 1.0


def solve_dijkstra(
    grid: List[List[Any]],
    start: Tuple[int, int],
    target: Tuple[int, int]
) -> Dict[str, Any]:
    """
    Manual Dijkstra Algorithm using a Min-Heap.
    Returns:
      - path: list of [row, col] from start to target
      - visited: order of cells finalized/visited
      - cost: total accumulated path weight
      - nodes_explored: number of unique nodes settled
      - execution_time_ms: algorithm runtime
    """
    t_start = time.perf_counter()

    rows = len(grid)
    cols = len(grid[0]) if rows > 0 else 0

    sr, sc = start
    tr, tc = target

    if not (0 <= sr < rows and 0 <= sc < cols and 0 <= tr < rows and 0 <= tc < cols):
        return {
            "path": [],
            "visited": [],
            "cost": 0,
            "nodes_explored": 0,
            "execution_time_ms": 0.0
        }

    # Min-Heap elements: (cumulative_cost, row, col)
    pq = [(0, sr, sc)]
    dist = {(sr, sc): 0}
    parent: Dict[Tuple[int, int], Tuple[int, int]] = {}
    visited_set = set()
    visited_order = []

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    found = False

    while pq:
        curr_cost, r, c = heapq.heappop(pq)

        if (r, c) in visited_set:
            continue
        visited_set.add((r, c))
        visited_order.append([r, c])

        if (r, c) == (tr, tc):
            found = True
            break

        if curr_cost > dist.get((r, c), float("inf")):
            continue

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                step_cost = get_cell_cost(grid[nr][nc])
                if step_cost == float("inf"):
                    continue

                new_cost = curr_cost + step_cost
                if new_cost < dist.get((nr, nc), float("inf")):
                    dist[(nr, nc)] = new_cost
                    parent[(nr, nc)] = (r, c)
                    heapq.heappush(pq, (new_cost, nr, nc))

    path: List[List[int]] = []
    if found:
        curr = (tr, tc)
        while curr in parent:
            path.append([curr[0], curr[1]])
            curr = parent[curr]
        path.append([sr, sc])
        path.reverse()

    t_end = time.perf_counter()
    duration_ms = (t_end - t_start) * 1000

    total_cost = int(dist.get((tr, tc), 0)) if found else 0

    return {
        "path": path,
        "visited": visited_order,
        "cost": total_cost,
        "nodes_explored": len(visited_set),
        "execution_time_ms": round(duration_ms, 3)
    }
