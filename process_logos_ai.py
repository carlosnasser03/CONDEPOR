import os
from PIL import Image
from rembg import remove

def process_logo_with_rembg(src_path, output_path, target_size=(256, 256)):
    print(f"AI background removal: {os.path.basename(src_path)} -> {output_path}...")
    img = Image.open(src_path).convert("RGBA")
    
    # Remove background using rembg neural network
    out_img = remove(img)
    
    # Crop tightly to non-transparent bounding box
    bbox = out_img.getbbox()
    if bbox:
        bx1, by1, bx2, by2 = bbox
        w, h = out_img.size
        pad_x = int((bx2 - bx1) * 0.04)
        pad_y = int((by2 - by1) * 0.04)
        bx1 = max(0, bx1 - pad_x)
        by1 = max(0, by1 - pad_y)
        bx2 = min(w, bx2 + pad_x)
        by2 = min(h, by2 + pad_y)
        out_img = out_img.crop((bx1, by1, bx2, by2))
    
    # Resize keeping aspect ratio centered inside clean transparent canvas
    out_img.thumbnail(target_size, Image.Resampling.LANCZOS)
    final_canvas = Image.new("RGBA", target_size, (0, 0, 0, 0))
    paste_x = (target_size[0] - out_img.width) // 2
    paste_y = (target_size[1] - out_img.height) // 2
    final_canvas.paste(out_img, (paste_x, paste_y), out_img)
    
    # Save optimized PNG
    final_canvas.save(output_path, "PNG", optimize=True)
    print(f"Saved {output_path} ({final_canvas.size}) - size: {os.path.getsize(output_path)} bytes")

def main():
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
    
    os.makedirs("LOGOS_EQUIPOS_OFICIALES", exist_ok=True)
    os.makedirs("frontend/public/crests", exist_ok=True)
    os.makedirs("backend/public/crests", exist_ok=True)

    for out_name, src_name in mapping.items():
        src = os.path.join(src_dir, src_name)
        if not os.path.exists(src):
            print(f"Skipping {src_name}, file not found")
            continue
        
        main_out = os.path.join("LOGOS_EQUIPOS_OFICIALES", out_name)
        fe_out = os.path.join("frontend/public/crests", out_name)
        be_out = os.path.join("backend/public/crests", out_name)
        
        process_logo_with_rembg(src, main_out, (256, 256))
        process_logo_with_rembg(src, fe_out, (256, 256))
        process_logo_with_rembg(src, be_out, (256, 256))

if __name__ == "__main__":
    main()
