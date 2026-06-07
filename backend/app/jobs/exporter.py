from __future__ import annotations

import csv
import json
import os
from pathlib import Path


def atomic_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_name(f".{path.name}.tmp")
    tmp_path.write_text(content, encoding="utf-8")
    os.replace(tmp_path, path)


def write_json(path: Path, rows: list[dict[str, object]]) -> None:
    atomic_write_text(path, json.dumps(rows, indent=2, ensure_ascii=True))


def write_csv(path: Path, rows: list[dict[str, object]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp_path = path.with_name(f".{path.name}.tmp")
    if not rows:
        tmp_path.write_text("", encoding="utf-8")
        os.replace(tmp_path, path)
        return
    fieldnames = list(rows[0].keys())
    with tmp_path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    os.replace(tmp_path, path)
