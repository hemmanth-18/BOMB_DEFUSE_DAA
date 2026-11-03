"""
Grid and Movement Validation Rules.
"""

from typing import List, Tuple, Any, Union


def is_valid_move(grid: List[List[Any]], current: Tuple[int, int], next_pos: Tuple[int, int]) -> bool:
    rows = len(grid)
    cols = len(grid[0]) if rows > 0 else 0
    cr, cc = current
    nr, nc = next_pos

    # Must be within bounds
    if not (0 <= nr < rows and 0 <= nc < cols):
        return False

    # Must be 1-step orthogonal move
    if abs(cr - nr) + abs(cc - nc) != 1:
        return False

    cell = grid[nr][nc]
    if isinstance(cell, str) and cell.upper() in ("W", "WALL", "#", "BLOCKED"):
        return False
    if isinstance(cell, dict) and cell.get("type") == "wall":
        return False
    if isinstance(cell, (int, float)) and cell < 0:
        return False

    return True
