import React, { useRef, useEffect, useState } from 'react';

export default function BadgeCanvas({
  mode,
  photo,
  builderName,
  stackRole,
  teamName,
  zoom = 1.0,
  panX = 0,
  panY = 0,
  onCanvasReady,
}) {
  const canvasRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const bgImageRef = useRef(null);

  // Preload background template image
  useEffect(() => {
    setBgLoaded(false);
    const img = new Image();
    img.src = mode === 'pfp' ? '/images/pfp_template.jpg' : '/images/idcard_template.jpg';
    img.onload = () => { bgImageRef.current = img; setBgLoaded(true); };
    img.onerror = () => { bgImageRef.current = null; setBgLoaded(true); };
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mode === 'pfp') {
      canvas.width = 1080;
      canvas.height = 1080;
    } else {
      canvas.width = 1080;
      canvas.height = 1620;
    }

    const W = canvas.width;
    const H = canvas.height;

    const YELLOW  = '#f7c515';
    const PINK    = '#ed1765';
    const CREAM   = '#f5ead5';
    const DKGREEN = '#004d3a';
    const TXTGRN  = '#004d3a';

    // ─── STEP 1: Draw everything synchronously ───────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // Background template
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, W, H);
    } else {
      ctx.fillStyle = DKGREEN;
      ctx.fillRect(0, 0, W, H);
    }

    if (mode === 'pfp') {
      drawPfpPlaceholder(ctx, W, H, YELLOW, PINK);
    } else {
      drawIdCardPlaceholder(ctx, W, H, YELLOW, PINK, CREAM, TXTGRN,
        builderName, stackRole, teamName);
    }

    // ─── STEP 2: If a user photo exists, paint it on top asynchronously ─────
    if (photo) {
      const img = new Image();
      img.onload = () => {
        if (mode === 'pfp') {
          paintPfpPhoto(ctx, img, W, H, zoom, panX, panY, YELLOW);
        } else {
          paintIdCardPhoto(ctx, img, W, H, zoom, panX, panY, PINK);
        }
        if (onCanvasReady) onCanvasReady(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        // Photo failed — placeholder already drawn, just emit canvas
        if (onCanvasReady) onCanvasReady(canvas.toDataURL('image/png'));
      };
      img.src = photo;
    } else {
      if (onCanvasReady) onCanvasReady(canvas.toDataURL('image/png'));
    }

  }, [mode, photo, builderName, stackRole, teamName, zoom, panX, panY, bgLoaded, onCanvasReady]);

  return (
    <div className="w-full flex justify-center">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#f7c515]/30 max-w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-[78vh] object-contain rounded-xl bg-[#004d3a]"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PFP helpers
// ─────────────────────────────────────────────────────────────────────────────

function drawPfpPlaceholder(ctx, W, H, YELLOW, PINK) {
  const cx = W / 2, cy = H / 2, r = 330;

  // Clip circle + semi-transparent fill
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(0,48,36,0.78)';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  // Border ring
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Camera icon
  drawCameraIcon(ctx, cx, cy - 20, 90, YELLOW);

  // Labels
  ctx.textAlign = 'center';
  ctx.fillStyle = YELLOW;
  ctx.font = '700 26px "Space Mono", monospace';
  ctx.fillText('UPLOAD YOUR PHOTO', cx, cy + 75);
  ctx.fillStyle = 'rgba(247,197,21,0.6)';
  ctx.font = '400 16px "Space Mono", monospace';
  ctx.fillText('for PFP Overlay', cx, cy + 102);
}

function paintPfpPhoto(ctx, img, W, H, zoom, panX, panY, YELLOW) {
  const cx = W / 2, cy = H / 2, r = 330;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.translate(cx + panX, cy + panY);
  ctx.scale(zoom, zoom);

  const asp = img.width / img.height;
  let rW = r * 2, rH = r * 2;
  if (asp > 1) { rW = r * 2 * asp; } else { rH = (r * 2) / asp; }
  ctx.drawImage(img, -rW / 2, -rH / 2, rW, rH);
  ctx.restore();

  // Re-draw border ring on top
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// ─────────────────────────────────────────────────────────────────────────────
// ID Card helpers
// ─────────────────────────────────────────────────────────────────────────────

const PHOTO_W = 495, PHOTO_H = 390, PHOTO_Y = 480, PHOTO_R = 24;

function drawIdCardPlaceholder(ctx, W, H, YELLOW, PINK, CREAM, TXTGRN, name, role, team) {
  const photoX = (W - PHOTO_W) / 2;

  // ── Photo placeholder box ─────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
  ctx.clip();
  ctx.fillStyle = 'rgba(0,48,36,0.82)';
  ctx.fillRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H);
  ctx.restore();

  // Dashed inner border
  ctx.save();
  ctx.setLineDash([14, 8]);
  ctx.strokeStyle = 'rgba(247,197,21,0.65)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(photoX + 20, PHOTO_Y + 20, PHOTO_W - 40, PHOTO_H - 40, 16);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Camera icon + text
  const cx = photoX + PHOTO_W / 2;
  const cy = PHOTO_Y + PHOTO_H / 2 - 22;
  drawCameraIcon(ctx, cx, cy, 78, YELLOW);

  ctx.textAlign = 'center';
  ctx.fillStyle = YELLOW;
  ctx.font = '700 24px "Space Mono", monospace';
  ctx.fillText('YOUR PHOTO HERE', cx, cy + 62);
  ctx.fillStyle = 'rgba(247,197,21,0.6)';
  ctx.font = '400 16px "Space Mono", monospace';
  ctx.fillText('Upload from the panel on the right', cx, cy + 88);

  // Pink border on top
  ctx.strokeStyle = PINK;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.roundRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
  ctx.stroke();

  // ── Cream info panel ──────────────────────────────────────────────────────
  drawInfoPanel(ctx, W, YELLOW, PINK, CREAM, TXTGRN, name, role, team);
}

function paintIdCardPhoto(ctx, img, W, H, zoom, panX, panY, PINK) {
  const photoX = (W - PHOTO_W) / 2;

  // Clip + paint user photo
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
  ctx.clip();

  const centerX = photoX + PHOTO_W / 2;
  const centerY = PHOTO_Y + PHOTO_H / 2;
  ctx.translate(centerX + panX, centerY + panY);
  ctx.scale(zoom, zoom);

  const asp = img.width / img.height;
  const fAsp = PHOTO_W / PHOTO_H;
  let rW = PHOTO_W, rH = PHOTO_H;
  if (asp > fAsp) { rH = PHOTO_H; rW = PHOTO_H * asp; }
  else             { rW = PHOTO_W; rH = PHOTO_W / asp; }
  ctx.drawImage(img, -rW / 2, -rH / 2, rW, rH);
  ctx.restore();

  // Pink border on top of photo
  ctx.strokeStyle = PINK;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.roundRect(photoX, PHOTO_Y, PHOTO_W, PHOTO_H, PHOTO_R);
  ctx.stroke();
}

function drawInfoPanel(ctx, W, YELLOW, PINK, CREAM, TXTGRN, name, role, team) {
  const boxW = 560, boxH = 340;
  const boxX = (W - boxW) / 2, boxY = 875;
  const rad  = 24;

  // Panel shadow + fill
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, rad);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  const lx = boxX + 28;

  // ROW 1 — NAME
  const y1 = boxY + 60;
  drawCircleIcon(ctx, lx + 22, y1, 'user', PINK);
  ctx.textAlign = 'left';
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 15px "Space Mono", monospace';
  ctx.fillText('NAME', lx + 62, y1 - 12);

  const displayName = name ? name.trim().toUpperCase() : 'YOUR NAME';
  ctx.fillStyle = name ? TXTGRN : 'rgba(0,77,58,0.45)';
  ctx.font = '900 32px "Playfair Display", serif';
  ctx.fillText(displayName, lx + 62, y1 + 18);
  dashedLine(ctx, lx, y1 + 35, boxX + 375, y1 + 35, PINK);

  // ROW 2 — ROLE
  const y2 = y1 + 100;
  drawCircleIcon(ctx, lx + 22, y2, 'briefcase', PINK);
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 15px "Space Mono", monospace';
  ctx.fillText('ROLE', lx + 62, y2 - 12);

  const displayRole = role ? role.trim().toUpperCase() : 'AI/ML ENGINEER';
  ctx.fillStyle = PINK;
  ctx.font = '800 24px "Space Mono", monospace';
  ctx.fillText(displayRole, lx + 62, y2 + 16);
  dashedLine(ctx, lx, y2 + 35, boxX + 375, y2 + 35, PINK);

  // ROW 3 — TEAM NAME
  const y3 = y2 + 100;
  drawCircleIcon(ctx, lx + 22, y3, 'team', PINK);
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 15px "Space Mono", monospace';
  ctx.fillText('TEAM NAME', lx + 62, y3 - 12);

  const displayTeam = team ? team.trim().toUpperCase().replace('@', '') : 'YOUR TEAM NAME';
  ctx.fillStyle = team ? PINK : 'rgba(237,23,101,0.5)';
  ctx.font = '800 24px "Space Mono", monospace';
  ctx.fillText(displayTeam, lx + 62, y3 + 16);

  // Vertical dashed divider
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(237,23,101,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(boxX + 395, boxY + 28);
  ctx.lineTo(boxX + 395, boxY + boxH - 28);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Right column: setting sun + anchor
  drawSun(ctx, boxX + 475, boxY + 100, YELLOW);
  drawAnchor(ctx, boxX + 475, boxY + 255, PINK);
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared drawing primitives
// ─────────────────────────────────────────────────────────────────────────────

function drawCameraIcon(ctx, cx, cy, size, color) {
  ctx.save();
  // Body
  ctx.fillStyle = 'rgba(247,197,21,0.12)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cx - size / 2, cy - size * 0.33, size, size * 0.66, 10);
  ctx.fill();
  ctx.stroke();
  // Lens outer
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
  ctx.stroke();
  // Lens inner filled
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.11, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  // Bump
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cx - size * 0.14, cy - size * 0.33 - size * 0.15, size * 0.28, size * 0.15, 4);
  ctx.stroke();
  ctx.restore();
}

function drawCircleIcon(ctx, cx, cy, type, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;

  if (type === 'user') {
    ctx.beginPath(); ctx.arc(cx, cy - 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy + 10, 10, Math.PI, 0); ctx.fill();
  } else if (type === 'briefcase') {
    ctx.fillRect(cx - 8, cy - 3, 16, 11);
    ctx.strokeRect(cx - 4, cy - 7, 8, 4);
  } else {
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 3, 4, 0, Math.PI * 2);
    ctx.arc(cx + 4, cy - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 4, cy + 10, 7, Math.PI, 0);
    ctx.arc(cx + 4, cy + 10, 7, Math.PI, 0);
    ctx.fill();
  }
}

function dashedLine(ctx, x1, y1, x2, y2, color) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawSun(ctx, sx, sy, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(sx, sy, 30, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(a) * 34, sy + Math.sin(a) * 34);
    ctx.lineTo(sx + Math.cos(a) * 44, sy + Math.sin(a) * 44);
    ctx.stroke();
  }
  ctx.restore();
}

function drawAnchor(ctx, ax, ay, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(ax, ay - 12, 5, 0, Math.PI * 2);
  ctx.moveTo(ax, ay - 7);
  ctx.lineTo(ax, ay + 12);
  ctx.moveTo(ax - 9, ay - 2);
  ctx.lineTo(ax + 9, ay - 2);
  ctx.moveTo(ax - 12, ay + 4);
  ctx.quadraticCurveTo(ax, ay + 16, ax + 12, ay + 4);
  ctx.stroke();
  ctx.restore();
}
