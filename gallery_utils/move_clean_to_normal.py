from pathlib import Path

GALLERY = Path(__file__).parent.parent / "static" / "images" / "gallery"

for clean in GALLERY.rglob("*_clean.*"):
    if clean.suffix.lower() not in (".jpg", ".jpeg"):
        continue
    if clean.stat().st_size == 0:
        print("SKIP (empty)", clean)
        continue
    original = clean.with_name(clean.name.replace("_clean", "", 1))
    clean.replace(original)
    print("OK  ", clean.name, "->", original.name)
