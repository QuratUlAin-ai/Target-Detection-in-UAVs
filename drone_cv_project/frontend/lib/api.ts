/** API host must match the page host (localhost vs 192.168.x.x on your LAN). */
export function getApiBase(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_API_URL ?? "").trim();

  if (typeof window !== "undefined") {
    if (fromEnv && (fromEnv.includes("ngrok") || !fromEnv.includes("localhost"))) {
      return fromEnv;
    }
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }

  return fromEnv || "http://localhost:8000";
}

function apiFetch(url: string, init?: RequestInit) {
  const base = getApiBase();
  const headers = new Headers(init?.headers);
  if (base.includes("ngrok")) {
    headers.set("ngrok-skip-browser-warning", "true");
  }
  return fetch(url, { ...init, headers });
}

export type Detection = {
  class_id   : number;
  class_name : string;
  confidence : number;
  corners    : number[][];
};

export type ModelResult = {
  model       : string;
  total       : number;
  detections  : Detection[];
  image_base64: string;
  image_size  : { w: number; h: number };
};

export type AllResult = {
  drones  : ModelResult;
  target  : ModelResult;
  military: ModelResult;
};

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await apiFetch(`${getApiBase()}/health`);
    return res.ok;
  } catch { return false; }
}

export async function predictSingle(
  file     : File,
  modelKey : "drones" | "target" | "military",
  conf = 0.25,
  iou  = 0.45,
): Promise<ModelResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch(`${getApiBase()}/predict/${modelKey}?conf=${conf}&iou=${iou}`, {
    method: "POST", body: form,
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? "Prediction failed");
  return res.json();
}

export async function predictAll(
  file: File,
  conf = 0.25,
  iou  = 0.45,
): Promise<AllResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiFetch(`${getApiBase()}/predict/all?conf=${conf}&iou=${iou}`, {
    method: "POST", body: form,
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? "Prediction failed");
  return res.json();
}

export async function runPrediction(
  modelKey: string,
  file: File,
  conf = 0.25,
  iou = 0.45,
): Promise<ModelResult & { processing_time: number }> {
  const start = performance.now();
  const result = await predictSingle(
    file,
    modelKey as "drones" | "target" | "military",
    conf,
    iou,
  );
  return {
    ...result,
    processing_time: (performance.now() - start) / 1000,
  };
}