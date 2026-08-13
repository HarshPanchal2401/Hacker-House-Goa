/**
 * faceDetection.js
 * 
 * Singleton wrapper around MediaPipe Tasks Vision FaceDetector.
 * Lazy-loads the WASM runtime + model on first use, then caches the detector.
 * All public functions fail gracefully → null, never throw to the caller.
 */

let _detector = null;
let _initPromise = null;

async function _initDetector() {
  try {
    // Dynamic import so the heavy WASM bundle is only fetched when needed
    const { FaceDetector, FilesetResolver } = await import('@mediapipe/tasks-vision');

    // Use the same version of WASM that matches the installed npm package
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );

    _detector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
        delegate: 'GPU',
      },
      runningMode: 'IMAGE',
      minDetectionConfidence: 0.45,
    });

    console.info('[FaceDetection] Model ready ✓');
    return _detector;
  } catch (err) {
    console.warn('[FaceDetection] Model init failed, using center-crop fallback:', err);
    return null;
  }
}

/**
 * Start loading the model immediately (call on app mount so it's ready by the time
 * the user picks a photo).
 */
export function warmUpDetector() {
  if (!_initPromise) _initPromise = _initDetector();
  return _initPromise;
}

/**
 * Detect the most prominent face in an HTMLImageElement.
 *
 * @param {HTMLImageElement} imgElement  - must already be loaded
 * @returns {Promise<{
 *   bbox:       { x: number, y: number, w: number, h: number },  // pixels
 *   keypoints:  Array<{ x: number, y: number, label: string }>,  // normalised 0-1
 *   confidence: number
 * } | null>}
 */
export async function detectFace(imgElement) {
  try {
    if (!_initPromise) _initPromise = _initDetector();
    const detector = await _initPromise;
    if (!detector) return null;

    const results = detector.detect(imgElement);
    if (!results?.detections?.length) return null;

    // Pick highest-confidence detection
    const best = results.detections.reduce((prev, cur) =>
      (cur.categories?.[0]?.score ?? 0) > (prev.categories?.[0]?.score ?? 0) ? cur : prev
    );

    const { originX, originY, width, height } = best.boundingBox;

    return {
      bbox: { x: originX, y: originY, w: width, h: height },
      // keypoints are normalised (0-1) to original image dimensions
      keypoints: best.keypoints || [],
      confidence: best.categories?.[0]?.score ?? 1,
    };
  } catch (err) {
    console.warn('[FaceDetection] detect() failed:', err);
    return null;
  }
}
