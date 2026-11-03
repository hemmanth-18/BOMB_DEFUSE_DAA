"""
Breadth-First Search (BFS) Algorithm for 2D Grid
=================================================
Implemented manually using collections.deque FIFO queue.
Finds the unweighted shortest path (minimum hops) between Start and Target.
Tracks full exploration order for step-by-step visualizer.
"""

import time
from collections import deque
from typing import List, Tuple, Dict, Any, Union


def is_walkable(cell: Union[int, str, dict]) -> bool:
    if isinstance(cell, dict):
        t = cell.get("type", "normal")
        return t != "wall" and cell.get("cost", 1) > 0
    if isinstance(cell, str):
        return cell.lower() not in ("wall", "w", "#", "blocked")
    if isinstance(cell, int):
        return cell >= 0
    return True


def solve_bfs(
    grid: List[List[Any]],
    start: Tuple[int, int],
    target: Tuple[int, int]
) -> Dict[str, Any]:
    """
    Manual BFS using a FIFO Queue.
    Returns:
      - path: list of [row, col] from start to target
      - visited: order of cells explored [[r, c], ...]
      - distance: number of steps in path
      - nodes_explored: total unique cells visited
      - execution_time_ms: algorithm runtime
    """
    t_start = time.perf_counter()

    rows = len(grid)
    cols = len(grid[0]) if rows > 0 else 0

    sr, sc = start
    tr, tc = target

    # Bounds check
    if not (0 <= sr < rows and 0 <= sc < cols and 0 <= tr < rows and 0 <= tc < cols):
        return {
            "path": [],
            "visited": [],
            "distance": 0,
            "nodes_explored": 0,
            "execution_time_ms": 0.0
        }

    # If start is target
    if (sr, sc) == (tr, tc):
        return {
            "path": [[sr, sc]],
            "visited": [[sr, sc]],
            "distance": 0,
            "nodes_explored": 1,
            "execution_time_ms": (time.perf_counter() - t_start) * 1000
        }

    queue = deque([(sr, sc)])
    visited_set = {(sr, sc)}
    visited_order = [[sr, sc]]
    parent: Dict[Tuple[int, int], Tuple[int, int]] = {}

    # 4-directional moves: Up, Down, Left, Right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    found = False
    while queue:
        r, c = queue.popleft()

        if (r, c) == (tr, tc):
            found = True
            break

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if (nr, nc) not in visited_set and is_walkable(grid[nr][nc]):
                    visited_set.add((nr, nc))
                    visited_order.append([nr, nc])
                    parent[(nr, nc)] = (r, c)
                    queue.append((nr, nc))

                    if (nr, nc) == (tr, tc):
                        found = True
                        break
        if found:
            break

    # Reconstruct path
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

    return {
        "path": path,
        "visited": visited_order,
        "distance": max(0, len(path) - 1) if path else 0,
        "nodes_explored": len(visited_set),
        "execution_time_ms": round(duration_ms, 3)
    }
