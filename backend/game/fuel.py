"""
Fuel management system.

Fuel decreases based on distance traveled along roads.
Different road types consume fuel at different rates.
"""

FUEL_CAPACITY = 100.0  # percentage

FUEL_CONSUMPTION_PER_UNIT = {
    "normal":  1.0,   # fuel % per cost unit
    "busy":    1.3,
    "heavy":   1.6,
    "damaged": 2.0,
    "blocked": 0.0,   # shouldn't happen
}

DEFAULT_CONSUMPTION = 1.2


def calculate_fuel_consumption(path_edges: list) -> float:
    """
    Calculate fuel used for a given path.
    path_edges: list of (weight, road_type) tuples
    Returns: fuel percentage consumed
    """
    total = 0.0
    for weight, road_type in path_edges:
        rate = FUEL_CONSUMPTION_PER_UNIT.get(road_type, DEFAULT_CONSUMPTION)
        total += weight * rate
    return min(total, FUEL_CAPACITY)


def calculate_fuel_for_cost(cost: float, road_type: str = "normal") -> float:
    """Simpler: fuel for a given total cost and average road type."""
    rate = FUEL_CONSUMPTION_PER_UNIT.get(road_type, DEFAULT_CONSUMPTION)
    return cost * rate


def refuel(current_fuel: float, amount: float = 50.0) -> float:
    """Refuel at a fuel station. Caps at 100%."""
    return min(current_fuel + amount, FUEL_CAPACITY)
