import glob
import os
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

def remove_background_and_resize(src_path, output_path, target_size=(256, 256)):
    print(f"Processing {src_path} -> {output_path}...")
    img = Image.open(src_path).convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    h, w, _ = arr.shape

    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)
    queue = deque()

    # Seed all outer border pixels as background starting points
    for x in range(w):
        queue.append((0, x))
        queue.append((h-1, x))
        visited[0, x] = True
        visited[h-1, x] = True
        is_bg[0, x] = True
        is_bg[h-1, x] = True
    for y in range(h):
        queue.append((y, 0))
        queue.append((y, w-1))
        visited[y, 0] = True
        visited[y, w-1] = True
        is_bg[y, 0] = True
        is_bg[y, w-1] = True

    # Gradient-aware BFS floodfill from border
    # If a pixel transitions smoothly (< 35 color distance) from its neighbor or from the corner, it's background
    while queue:
        cy, cx = queue.popleft()
        curr_color = arr[cy, cx, :3]
        for ny, nx in ((cy-1, cx), (cy+1, cx), (cy, cx-1), (cy, cx+1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                next_color = arr[ny, nx, :3]
                # Check local gradient (distance between adjacent pixels)
                # Also prevent entering bright/colored emblem parts by checking if it's still relatively dark/neutral or close to border color
                dist_local = np.linalg.norm(next_color - curr_color)
                # If local distance is small (smooth gradient in studio background) and we haven't hit the bright emblem boundary
                if dist_local < 28.0:
                    visited[ny, nx] = True
                    is_bg[ny, nx] = True
                    queue.append((ny, nx))

    # Also clean up any lingering isolated border patches or dark corners
    # Let's create alpha mask from is_bg
    mask = (~is_bg * 255).astype(np.uint8)
    mask_img = Image.fromarray(mask, mode='L')
    
    # Slight blur on edges for anti-aliased smooth contour
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=1.0))
    
    arr_out = np.array(img)
    arr_out[:, :, 3] = np.array(mask_img)
    out_img = Image.fromarray(arr_out, mode='RGBA')

    # Crop tightly around the remaining visible logo (where alpha > 10)
    bbox = out_img.getbbox()
    if bbox:
        bx1, by1, bx2, by2 = bbox
        pad_x = int((bx2 - bx1) * 0.04)
        pad_y = int((by2 - by1) * 0.04)
        bx1 = max(0, bx1 - pad_x)
        by1 = max(0, by1 - pad_y)
        bx2 = min(w, bx2 + pad_x)
        by2 = min(h, by2 + pad_y)
        out_img = out_img.crop((bx1, by1, bx2, by2))

    # Resize smoothly to target 256x256 inside a clean transparent square
    out_img.thumbnail(target_size, Image.Resampling.LANCZOS)
    final_canvas = Image.new("RGBA", target_size, (0, 0, 0, 0))
    paste_x = (target_size[0] - out_img.width) // 2
    paste_y = (target_size[1] - out_img.height) // 2
    final_canvas.paste(out_img, (paste_x, paste_y), out_img)

    final_canvas.save(output_path, "PNG", optimize=True)

def main():
    # Source mapping to pristine generated artifacts
    src_dir = r"C:\Users\cavilez\.gemini\antigravity\brain\164c5686-2aed-4386-ac03-d5684cd105c6"
    mapping = {
        "cd_olimpia.png": "olimpia_crest_1784151291404.png",
        "fc_motagua.png": "motagua_crest_1784151305531.png",
        "real_cd_espana.png": "espana_crest_1784151317324.png",
        "cd_marathon.png": "marathon_crest_1784151328346.png",
        "lobos_upnfm.png": "upnfm_crest_1784151340371.png",
        "cd_victoria.png": "victoria_crest_1784151351850.png",
        "cds_vida.png": "vida_crest_1784151362795.png",
        "genesis_comayagua.png": "genesis_crest_1784151374994.png"
    }

    for out_name, src_name in mapping.items():
        src = os.path.join(src_dir, src_name)
        if not os.path.exists(src):
            print(f"Skipping {src_name}, not found")
            continue
        
        main_out = os.path.join("LOGOS_EQUIPOS_OFICIALES", out_name)
        fe_out = os.path.join("frontend/public/crests", out_name)
        be_out = os.path.join("backend/public/crests", out_name)
        
        remove_background_and_resize(src, main_out, (256, 256))
        remove_background_and_resize(src, fe_out, (256, 256))
        remove_background_and_resize(src, be_out, (256, 256))

if __name__ == "__main__":
    main()
