import os
import sys
from PIL import Image, ImageOps as ImageOperations
from pathlib import Path

# ansi stuff
ANSI = "\033["
GREEN = f"{ANSI}32m"
RED = f"{ANSI}31m"
YELLOW = f"{ANSI}33m"
BLUE = f"{ANSI}34m"
RESET = f"{ANSI}0m"

GALLERY_FOLDER = Path("static") / "images" / "gallery"
THUMBNAIL_SIZE_LANDSCAPE = (512, 384)
THUMBNAIL_SIZE_PORTRAIT = (384, 512)
VALID_EXTENSIONS = {
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.tiff',
    '.webp'
}
SUFFIX = "-thumbnail"
EXTENSION = ".webp"


def crop(img: Image.Image, aspect_ratio: float) -> Image.Image:
    width, height = img.size
    target_ratio = aspect_ratio

    if width / height > target_ratio:
        # too wide
        new_width = int(height * target_ratio)
        left = (width - new_width) // 2
        right = left + new_width
        box = (left, 0, right, height)
    else:
        # too tall
        new_height = int(width / target_ratio)
        top = (height - new_height) // 2
        bottom = top + new_height
        box = (0, top, width, bottom)

    return img.crop(box)


def calculate_aspect_ratio(dimensions: tuple[int, int]) -> float:
    width, height = dimensions
    if height == 0:
        raise ValueError("Height cannot be zero")
    return width / height


def generate_thumbnails():
    for root, _, files in os.walk(GALLERY_FOLDER):
        for file in files:
            base, ext = os.path.splitext(file)
            ext = ext.lower()

            if SUFFIX in base:
                # file is a thumbnail
                continue

            if ext not in VALID_EXTENSIONS:
                continue

            image_path = Path(root) / file

            base_name, _ = os.path.splitext(file)
            thumb_path = os.path.join(
                root,
                base_name + SUFFIX + EXTENSION
            )

            if os.path.exists(thumb_path):
                print(
                    f"{YELLOW}{base_name}{ext} already has a "
                    "thumbnail, skipping thumbnail "
                    f"creation...{RESET}"
                )
                continue

            try:
                with Image.open(image_path) as img:
                    THUMBNAIL_SIZE = THUMBNAIL_SIZE_LANDSCAPE

                    # If the image has an EXIF Orientation tag
                    # other than 1, transpose the image and remove
                    # the orientation data
                    img = ImageOperations.exif_transpose(img)

                    img_cropped = crop(
                        img,
                        aspect_ratio=calculate_aspect_ratio(THUMBNAIL_SIZE)
                    ).resize(THUMBNAIL_SIZE, Image.Resampling.LANCZOS)

                    if img_cropped.mode in ("RGBA", "P"):
                        img_cropped = img_cropped.convert("RGB")

                    img_cropped.save(thumb_path, format="WEBP")
                    print(f"{GREEN}Created thumbnail {thumb_path}{RESET}")
            except Exception as e:
                print(
                    f"{RED}Failed to create thumbnail "
                    f"for {image_path}: {e}{RESET}"
                )


try:
    print("Generating thumbnails...\n")
    generate_thumbnails()
    print(f"\n{GREEN}Successfully generated thumbnails!{RESET}")
except Exception as e:
    print(f"\n{RED}An error has occurred: {RESET}" + str(e))
    sys.exit(1)
