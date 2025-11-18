#!/usr/bin/env python3
import json
from datetime import datetime
from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw, ImageFont

DATA_PATH = Path("screenshots/response_times.json")
OUTPUT_PATH = Path("screenshots/api_response_times.png")

HD_WIDTH = 1920
HD_HEIGHT = 1080
PADDING_X = 80
PADDING_Y = 80
LINE_SPACING_EXTRA = 12
HEADER_COLOR = (66, 133, 244)
TEXT_PRIMARY = (230, 232, 235)
TEXT_SECONDARY = (173, 181, 189)
BACKGROUND = (10, 14, 23)

FONT_CANDIDATES = [
    "/System/Library/Fonts/SFMono-Regular.otf",
    "/System/Library/Fonts/SFNSMono.ttf",
    "/System/Library/Fonts/Menlo.ttc",
    "/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Monaco.ttf",
]
DEFAULT_FONT_SIZE = 32


def load_font(size: int = DEFAULT_FONT_SIZE) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    return ImageFont.load_default()


def text_size(font: ImageFont.ImageFont, text: str) -> Tuple[int, int]:
    bbox = font.getbbox(text)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    return width, height


def load_results():
    with DATA_PATH.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def prepare_lines(results):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header = f"Kaizen API Response Times (captured {timestamp})"
    columns = "METHOD  PATH                                         STATUS   TIME (ms)  NOTE"
    separator = "-" * max(len(header), len(columns))
    lines = [header, columns, separator]
    for item in results:
        method = item.get("method", "-")
        path = item.get("path", "-")
        status = item.get("status_code", "-")
        elapsed = item.get("elapsed_ms", 0)
        note = item.get("note", "")
        note_text = note if note else ""
        line = f"{method:<6} {path:<45} {status!s:<7} {elapsed:>9.2f}  {note_text}"
        lines.append(line)
    return lines


def render(lines):
    font = load_font()
    _, base_height = text_size(font, "Ag")
    line_height = base_height + LINE_SPACING_EXTRA
    max_line_width = max(text_size(font, line)[0] for line in lines)
    content_width = max_line_width + PADDING_X * 2
    content_height = line_height * len(lines) + PADDING_Y * 2
    width = max(content_width, HD_WIDTH)
    height = max(content_height, HD_HEIGHT)

    image = Image.new("RGB", (width, height), color=BACKGROUND)
    draw = ImageDraw.Draw(image)

    y = PADDING_Y
    for idx, line in enumerate(lines):
        if idx == 0:
            fill = HEADER_COLOR
        elif idx == 1:
            fill = TEXT_PRIMARY
        elif idx == 2:
            fill = TEXT_SECONDARY
        else:
            fill = TEXT_PRIMARY if idx % 2 else TEXT_SECONDARY
        draw.text((PADDING_X, y), line, font=font, fill=fill)
        y += line_height

    image.save(OUTPUT_PATH)
    return OUTPUT_PATH


def main():
    results = load_results()
    lines = prepare_lines(results)
    output = render(lines)
    print(f"Saved screenshot to {output}")


if __name__ == "__main__":
    main()
