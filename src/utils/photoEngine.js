/**
 * photoEngine.js
 *
 * Computes zoom + panX/panY so a detected face is passport-sized and centred
 * in the ID-card or PFP frame.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BadgeCanvas drawing pipeline:
 *
 *   ctx.translate(frameCenterX + panX, frameCenterY + panY)
 *   ctx.scale(zoom, zoom)
 *   ctx.drawImage(img, -rW/2, -rH/2, rW, rH)   // rW/rH = cover dims at zoom=1
 *
 * Image pixel at (px, py) in original image → canvas coords:
 *   canvasX = frameCenterX + panX + (px/imgW - 0.5) * rW * zoom
 *   canvasY = frameCenterY + panY + (py/imgH - 0.5) * rH * zoom
 *
 * To place face centre (fcx, fcy) at frame centre:
 *   panX = -(fcx - 0.5) * rW * zoom
 *   panY = -(fcy - 0.5) * rH * zoom
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Frame pixel dims matching BadgeCanvas.jsx constants
 *  idcard: diameter = 2 * CARD_R = 2 * 195 = 390
 *  pfp:    diameter = 2 * r      = 2 * 330 = 660
 */
export const FRAME_DIMS = {
  idcard: { w: 390, h: 390 },   // circle: 2 * CARD_R
  pfp:    { w: 660, h: 660 },   // circle: 2 * r
};

/**
 * What fraction of the FRAME HEIGHT should the face occupy.
 *
 * Both frames are now circles, so frameH = diameter.
 * Target 0.55 → face = 55% of circle diameter — classic headshot with
 * forehead, face and a hint of neck/shoulder visible.
 */
const TARGET_FACE_RATIO = {
  idcard: 0.55,   // face = 55% of 390 px circle diameter
  pfp:    0.50,   // face = 50% of 660 px circle diameter
};

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

/**
 * Cover-mode dimensions at zoom = 1 — matches BadgeCanvas logic exactly.
 *
 * s = the scale factor that makes the image just cover the frame.
 * At zoom=1: image renders at (imgW*s) × (imgH*s), centred in frame.
 */
function coverDims(imgW, imgH, frameW, frameH) {
  const s = Math.max(frameW / imgW, frameH / imgH);
  return { rW: imgW * s, rH: imgH * s, s };
}

/**
 * Find the best "face centre" in normalised image coordinates (0-1).
 *
 * MediaPipe BlazeFace short-range keypoint order:
 *   0: rightEye  1: leftEye  2: noseTip  3: mouthCenter
 *   4: rightEarTragion  5: leftEarTragion
 *
 * Vertical anchor = eye midpoint (makes the face appear centred between
 * forehead and chin in the frame, not at the nose tip).
 */
function extractFaceCentre(faceResult, imgW, imgH) {
  const { bbox, keypoints: kp } = faceResult;

  const rightEye = kp?.[0];
  const leftEye  = kp?.[1];
  const noseTip  = kp?.[2];

  // ── Horizontal: nose tip is the most stable anchor (works for profiles too)
  let fcx;
  if (noseTip)              fcx = noseTip.x;
  else if (rightEye && leftEye) fcx = (rightEye.x + leftEye.x) / 2;
  else                      fcx = (bbox.x + bbox.w * 0.5) / imgW;

  // ── Vertical: eye midpoint keeps forehead + chin balanced in frame
  let fcy;
  if (rightEye && leftEye) {
    fcy = (rightEye.y + leftEye.y) / 2;
  } else if (noseTip) {
    // Shift up from nose tip by ~18% of bbox height to reach eye level
    fcy = noseTip.y - (bbox.h * 0.18) / imgH;
  } else {
    // Approx eye level = top of bbox + 38%
    fcy = (bbox.y + bbox.h * 0.38) / imgH;
  }

  return {
    fcx: clamp(fcx, 0.01, 0.99),
    fcy: clamp(fcy, 0.01, 0.99),
  };
}

/**
 * Main export — compute zoom + panX/panY for smart face framing.
 *
 * Key constraint: zoom must always be ≥ 1.0 so the photo fills the entire
 * frame (no exposed background at edges). For extreme close-up selfies where
 * the face is already large at zoom=1, we keep zoom=1 and just centre the face
 * (the face will still be a bit large, but the frame is always fully covered).
 *
 * @param {{ imgWidth, imgHeight, mode, faceResult }} params
 * @returns {{ zoom: number, panX: number, panY: number }}
 */
export function computePhotoPlacement({ imgWidth, imgHeight, mode, faceResult }) {
  const { w: frameW, h: frameH } = FRAME_DIMS[mode] ?? FRAME_DIMS.idcard;
  const targetR = TARGET_FACE_RATIO[mode] ?? 0.55;

  const { rW, rH } = coverDims(imgWidth, imgHeight, frameW, frameH);

  // ── No face → centred cover crop (safe default) ──────────────────────────
  if (!faceResult) {
    return { zoom: 1.0, panX: 0, panY: 0 };
  }

  const { bbox } = faceResult;

  // ── Zoom calculation ──────────────────────────────────────────────────────
  // At zoom Z, the face appears as:  faceH_pixels = bbox.h * (rH / imgHeight) * Z
  // We want:  faceH_pixels = targetR * frameH
  // → Z = (targetR * frameH * imgHeight) / (bbox.h * rH)
  //
  // Equivalently using cover scale s: faceAtZ1 = bbox.h * s
  //   Z = (targetR * frameH) / faceAtZ1
  //
  // IMPORTANT: Clamp minimum to 1.0 so the frame is always fully covered.
  // For close-up selfies this means the face will be larger than targetR,
  // but that's unavoidable without letterboxing (which we avoid for cleanliness).
  const s = Math.max(frameW / imgWidth, frameH / imgHeight);  // cover scale
  const faceAtZ1 = bbox.h * s;                                // face px at zoom=1
  let zoom = (targetR * frameH) / faceAtZ1;
  zoom = clamp(zoom, 1.0, 2.8);  // MINIMUM 1.0 = always cover frame

  // ── Pan: centre face in frame ─────────────────────────────────────────────
  const { fcx, fcy } = extractFaceCentre(faceResult, imgWidth, imgHeight);

  let panX = -(fcx - 0.5) * rW * zoom;
  let panY = -(fcy - 0.5) * rH * zoom;

  // ── Clamp pan: image must still fully cover the frame ───────────────────
  // At zoom Z the image is rW*Z × rH*Z. For it to cover frameW × frameH
  // centred at frame centre, the max pan in each axis is:
  //   |panX| ≤ (rW*zoom - frameW) / 2
  //   |panY| ≤ (rH*zoom - frameH) / 2
  // Since zoom ≥ 1.0, rW*zoom ≥ rW ≥ frameW (cover guarantee), so maxPan ≥ 0.
  const maxPanX = (rW * zoom - frameW) / 2;
  const maxPanY = (rH * zoom - frameH) / 2;
  panX = clamp(panX, -maxPanX, maxPanX);
  panY = clamp(panY, -maxPanY, maxPanY);

  return { zoom, panX, panY };
}
