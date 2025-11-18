#!/usr/bin/env python3
import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Tuple

from PIL import Image, ImageDraw, ImageFont

DATA_PATH = Path("screenshots/response_times.json")
OUTPUT_DIR = Path("screenshots/terminal")
BACKGROUND = (10, 14, 23)
TEXT_PRIMARY = (219, 224, 230)
TEXT_SECONDARY = (136, 146, 160)
TEXT_COMMAND = (248, 189, 150)
TEXT_KEYS = (94, 170, 246)

PADDING_X = 120
PADDING_Y = 100
LINE_SPACING_EXTRA = 18
MIN_WIDTH = 1920
MIN_HEIGHT = 1080

FONT_CANDIDATES = [
    "/System/Library/Fonts/SFMono-Regular.otf",
    "/System/Library/Fonts/SFNSMono.ttf",
    "/System/Library/Fonts/Menlo.ttc",
    "/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Monaco.ttf",
]
DEFAULT_FONT_SIZE = 40


def load_font(size: int = DEFAULT_FONT_SIZE) -> ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        font_path = Path(path)
        if font_path.exists():
            try:
                return ImageFont.truetype(str(font_path), size)
            except OSError:
                continue
    return ImageFont.load_default()


def text_size(font: ImageFont.ImageFont, text: str) -> Tuple[int, int]:
    bbox = font.getbbox(text)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    return width, height


def sanitize_filename(index: int, method: str, path: str) -> str:
    raw = f"{index:02d}-{method}-{path.strip('/')}"
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "-", raw).strip("-")
    return cleaned or f"endpoint-{index:02d}"


def format_lines(item: dict, timestamp: str) -> List[Tuple[str, Tuple[int, int, int]]]:
    key_width = 9

    def kv(key: str, value: str) -> str:
        return f"{key.ljust(key_width)}: {value}"

    lines: List[Tuple[str, Tuple[int, int, int]]] = []
    lines.append((f"$ kaizen-measure --name \"{item.get('name', 'Unknown')}\"", TEXT_COMMAND))
    lines.append((kv("method", item.get("method", "-")), TEXT_KEYS))
    lines.append((kv("path", item.get("path", "-")), TEXT_PRIMARY))
    status = item.get("status_code")
    status_text = str(status) if status is not None else "-"
    lines.append((kv("status", status_text), TEXT_PRIMARY))
    elapsed = item.get("elapsed_ms")
    elapsed_text = f"{elapsed:.2f} ms" if isinstance(elapsed, (int, float)) else "-"
    lines.append((kv("elapsed", elapsed_text), TEXT_PRIMARY))
    message = item.get("message") or "-"
    lines.append((kv("message", message), TEXT_SECONDARY))
    if item.get("note"):
        lines.append((kv("note", item["note"]), TEXT_SECONDARY))
    if item.get("error"):
        lines.append((kv("error", item["error"]), TEXT_SECONDARY))
    lines.append((kv("captured", timestamp), TEXT_SECONDARY))
    return lines


def compute_canvas_size(
    lines: List[Tuple[str, Tuple[int, int, int]]], font: ImageFont.ImageFont
) -> Tuple[int, int, int]:
    max_line_width = max(text_size(font, text)[0] for text, _ in lines)
    _, base_height = text_size(font, "Ag")
    line_height = base_height + LINE_SPACING_EXTRA
    width = max(max_line_width + PADDING_X * 2, MIN_WIDTH)
    height = max(line_height * len(lines) + PADDING_Y * 2, MIN_HEIGHT)
    return width, height, line_height


def draw_lines(
    image: Image.Image,
    lines: List[Tuple[str, Tuple[int, int, int]]],
    font: ImageFont.ImageFont,
    line_height: int,
) -> None:
    draw = ImageDraw.Draw(image)
    y = PADDING_Y
    for text, color in lines:
        draw.text((PADDING_X, y), text, font=font, fill=color)
        y += line_height


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Missing data file: {DATA_PATH}")

    with DATA_PATH.open("r", encoding="utf-8") as fh:
        results = json.load(fh)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for image_file in OUTPUT_DIR.glob("*.png"):
        image_file.unlink()

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    font = load_font()

    for index, item in enumerate(results, start=1):
        lines = format_lines(item, timestamp)
        width, height, line_height = compute_canvas_size(lines, font)
        image = Image.new("RGB", (width, height), color=BACKGROUND)
        draw_lines(image, lines, font, line_height)
        filename = sanitize_filename(index, item.get("method", "GET"), item.get("path", "/"))
        output_path = OUTPUT_DIR / f"{filename}.png"
        image.save(output_path)
        print(f"Saved {output_path}")


if __name__ == "__main__":
    main()
