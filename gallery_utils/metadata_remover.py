# ruff: noqa: BLE001

from pathlib import Path

from PIL import Image, ImageOps, JpegImagePlugin

GALLERY = Path(__file__).parent.parent / "static" / "images" / "gallery"


def strip(src: Path, dst: Path):
    with Image.open(src) as im:
        icc = im.info.get("icc_profile")
        subsampling = JpegImagePlugin.get_sampling(im)
        im = ImageOps.exif_transpose(im)
        im.info.clear()
        tmp = dst.with_name(dst.name + ".tmp")
        try:
            im.save(
                tmp,
                "JPEG",
                quality=95,
                subsampling=subsampling,
                icc_profile=icc,
                optimize=True,
            )
            tmp.replace(dst)
        finally:
            tmp.unlink(missing_ok=True)


for f in GALLERY.rglob("*"):
    if f.suffix.lower() in (".jpg", ".jpeg") and not any(
        f.stem.endswith(x) for x in ("_clean", "-thumbnail")
    ):
        dst = f.with_name(f"{f.stem}_clean{f.suffix}")
        try:
            strip(f, dst)
            print("OK  ", f)
        except Exception as e:
            print("FAIL", f, e)
