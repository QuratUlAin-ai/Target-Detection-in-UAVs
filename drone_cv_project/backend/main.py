from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn, numpy as np, cv2, base64, io, os
from PIL import Image
from ultralytics import YOLO

app = FastAPI(title="Drone CV API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

print("Loading models...")
MODELS = {
    "drones":   YOLO(os.path.join(MODEL_DIR, "drones_best.pt")),
    "target":   YOLO(os.path.join(MODEL_DIR, "target_best.pt")),
    "military": YOLO(os.path.join(MODEL_DIR, "military_best.pt")),
}
print("✅ All 3 models loaded")


def read_image(file_bytes: bytes) -> np.ndarray:
    pil = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def to_base64(img: np.ndarray) -> str:
    _, buf = cv2.imencode(".png", img)
    return base64.b64encode(buf.tobytes()).decode("utf-8")


def run_model(key: str, img: np.ndarray, conf: float, iou: float) -> dict:
    model   = MODELS[key]
    results = model.predict(img, conf=conf, iou=iou, verbose=False)
    r       = results[0]

    detections = []
    if r.obb is not None:
        for i in range(len(r.obb)):
            cls_id = int(r.obb.cls[i].item())
            detections.append({
                "class_id"  : cls_id,
                "class_name": model.names[cls_id],
                "confidence": round(float(r.obb.conf[i].item()), 4),
                "corners"   : r.obb.xyxyxyxy[i].cpu().numpy().tolist(),
            })

    return {
        "model"       : key,
        "total"       : len(detections),
        "detections"  : detections,
        "image_base64": to_base64(r.plot(font_size=10, line_width=2)),
        "image_size"  : {"w": img.shape[1], "h": img.shape[0]},
    }


@app.get("/health")
def health():
    return {"status": "ok", "models": list(MODELS.keys())}


@app.post("/predict/{model_key}")
async def predict_single(
    model_key: str,
    file: UploadFile = File(...),
    conf: float = 0.25,
    iou:  float = 0.45,
):
    if model_key not in MODELS:
        raise HTTPException(400, f"Unknown model. Choose from: {list(MODELS.keys())}")
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    img = read_image(await file.read())
    return JSONResponse(run_model(model_key, img, conf, iou))


@app.post("/predict/all")
async def predict_all(
    file: UploadFile = File(...),
    conf: float = 0.25,
    iou:  float = 0.45,
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    raw = await file.read()
    img = read_image(raw)
    return JSONResponse({k: run_model(k, img, conf, iou) for k in MODELS})


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)