"""Verify exported video geometry/duration and all required deliverables."""
import argparse
import json
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("scene")
parser.add_argument("--out", type=Path, default=Path("dist/motion"))
args = parser.parse_args()
for suffix in ["16x9.mp4", "4x5.mp4", "16x9.webm", "16x9.gif", "poster.png"]:
    path = args.out / f"{args.scene}-{suffix}"
    assert path.is_file() and path.stat().st_size > 0, f"Missing/empty {path}"
lengths = []
for suffix, width, height in [("16x9.mp4", 1600, 900), ("4x5.mp4", 1080, 1350), ("16x9.webm", 1600, 900)]:
    path = args.out / f"{args.scene}-{suffix}"
    result = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)], text=True))
    stream = next(s for s in result["streams"] if s["codec_type"] == "video")
    assert (stream["width"], stream["height"]) == (width, height), f"Wrong dimensions: {path}"
    duration = float(result["format"]["duration"])
    assert duration > 0, f"Empty duration: {path}"
    lengths.append(duration)
    print(f"{path.name}: {width}x{height}, {duration:.3f}s")
assert max(lengths) - min(lengths) < 0.1, "Export durations disagree"
