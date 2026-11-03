"""
Traffic system — dynamic weight modifiers per game level/event.
"""

from typing import Dict

# Level-based traffic presets
TRAFFIC_PRESETS: Dict[str, Dict[str, float]] = {
    "normal": {
        "normal":  1.0,
        "busy":    1.0,
        "heavy":   1.0,
        "damaged": 1.0,
    },
    "moderate": {
        "normal":  1.0,
        "busy":    1.5,
        "heavy":   2.0,
        "damaged": 1.5,
    },
    "heavy": {
        "normal":  1.0,
        "busy":    2.5,
        "heavy":   4.0,
        "damaged": 3.0,
    },
    "rush_hour": {
        "normal":  1.5,
        "busy":    3.0,
        "heavy":   5.0,
        "damaged": 4.0,
    },
}

LEVEL_TRAFFIC_MAP = {
    1: "normal",
    2: "normal",
    3: "moderate",
    4: "heavy",
}


def get_traffic_preset(level: int) -> Dict[str, float]:
    preset_name = LEVEL_TRAFFIC_MAP.get(level, "normal")
    return TRAFFIC_PRESETS.get(preset_name, TRAFFIC_PRESETS["normal"])


def get_traffic_level_name(level: int) -> str:
    return LEVEL_TRAFFIC_MAP.get(level, "normal")
