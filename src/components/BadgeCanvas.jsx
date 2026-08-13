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
  const cx = W / 2, cy = H / 2, r = 318;

  // Clip circle + semi-transparent fill
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(0,48,36,0.78)';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

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
  const cx = W / 2, cy = H / 2, r = 318;

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

  // Draw yellow border ring around user photo
  ctx.save();
  ctx.strokeStyle = YELLOW;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}





// ─────────────────────────────────────────────────────────────────────────────
// ID Card helpers
// ─────────────────────────────────────────────────────────────────────────────

// ID card circular photo — centre and radius in canvas pixels
const CARD_R  = 195;           // radius
const CARD_CX = 540;           // horizontal centre (= W/2 for 1080-wide canvas)
const CARD_CY = 675;           // vertical centre

function drawIdCardPlaceholder(ctx, W, H, YELLOW, PINK, CREAM, TXTGRN, name, role, team) {
  const cx = CARD_CX, cy = CARD_CY, r = CARD_R;

  // ── Circle placeholder ────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(0,48,36,0.82)';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  // Dashed inner ring
  ctx.save();
  ctx.setLineDash([14, 8]);
  ctx.strokeStyle = 'rgba(247,197,21,0.65)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Camera icon + label
  drawCameraIcon(ctx, cx, cy - 20, 80, YELLOW);
  ctx.textAlign = 'center';
  ctx.fillStyle = YELLOW;
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.fillText('YOUR PHOTO HERE', cx, cy + 68);
  ctx.fillStyle = 'rgba(247,197,21,0.6)';
  ctx.font = '400 15px "Space Mono", monospace';
  ctx.fillText('Face auto-detected & centred', cx, cy + 94);

  // Pink circle border
  ctx.strokeStyle = PINK;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // ── Info panel below ─────────────────────────────────────────────────────
  drawInfoPanel(ctx, W, YELLOW, PINK, CREAM, TXTGRN, name, role, team);
}

function paintIdCardPhoto(ctx, img, W, H, zoom, panX, panY, PINK) {
  const cx = CARD_CX, cy = CARD_CY, r = CARD_R;

  // Clip to circle, paint photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.translate(cx + panX, cy + panY);
  ctx.scale(zoom, zoom);

  // Cover the circle frame (2r × 2r)
  const asp = img.width / img.height;
  let rW = r * 2, rH = r * 2;
  if (asp > 1) { rW = r * 2 * asp; }
  else         { rH = (r * 2) / asp; }
  ctx.drawImage(img, -rW / 2, -rH / 2, rW, rH);
  ctx.restore();

  // Pink circle border on top
  ctx.strokeStyle = PINK;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawInfoPanel(ctx, W, YELLOW, PINK, CREAM, TXTGRN, name, role, team) {
  const boxW = 500, boxH = 320;
  const boxX = (W - boxW) / 2, boxY = 875;
  const rad  = 26;

  // Panel shadow + fill
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, rad);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Golden inner border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8, rad - 4);
  ctx.stroke();

  const lx = boxX + 22;

  // ── ROW 1 — NAME ──────────────────────────────────────────────────────────
  const y1 = boxY + 52;
  drawCircleIcon(ctx, lx + 20, y1, 'user', PINK);
  ctx.textAlign = 'left';
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 14px "Space Mono", monospace';
  ctx.fillText('NAME', lx + 56, y1 - 12);

  const displayName = name ? name.trim().toUpperCase() : 'HARSH PANCHAL';
  ctx.fillStyle = TXTGRN;
  ctx.font = '900 32px "Playfair Display", serif';
  ctx.fillText(displayName, lx + 56, y1 + 18);

  // Horizontal dashed divider 1
  dashedLine(ctx, boxX + 16, boxY + 102, boxX + boxW - 16, boxY + 102, 'rgba(212, 175, 55, 0.6)');

  // ── ROW 2 — ROLE ──────────────────────────────────────────────────────────
  const y2 = boxY + 152;
  drawCircleIcon(ctx, lx + 20, y2, 'briefcase', PINK);
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 14px "Space Mono", monospace';
  ctx.fillText('ROLE', lx + 56, y2 - 12);

  const displayRole = role ? role.trim().toUpperCase() : 'AI/ML ENGINEER';
  ctx.fillStyle = PINK;
  ctx.font = '800 23px "Space Mono", monospace';
  ctx.fillText(displayRole, lx + 56, y2 + 16);

  // Horizontal dashed divider 2
  dashedLine(ctx, boxX + 16, boxY + 202, boxX + boxW - 16, boxY + 202, 'rgba(212, 175, 55, 0.6)');

  // ── ROW 3 — BUILDER TITLE ─────────────────────────────────────────────────
  const y3 = boxY + 252;
  drawCircleIcon(ctx, lx + 20, y3, 'star', PINK);
  ctx.fillStyle = TXTGRN;
  ctx.font = '800 14px "Space Mono", monospace';
  ctx.fillText('BUILDER TITLE', lx + 56, y3 - 12);

  const displayTeam = team ? team.trim().toUpperCase().replace('@', '') : 'AGENT ARCHITECT';
  ctx.fillStyle = PINK;
  ctx.font = '800 23px "Space Mono", monospace';
  ctx.fillText(displayTeam, lx + 56, y3 + 16);
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
  ctx.arc(cx, cy, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2.5;

  if (type === 'user') {
    ctx.beginPath(); ctx.arc(cx, cy - 5, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy + 12, 12, Math.PI, 0); ctx.fill();
  } else if (type === 'briefcase') {
    ctx.fillRect(cx - 10, cy - 4, 20, 14);
    ctx.strokeRect(cx - 5, cy - 9, 10, 5);
  } else if (type === 'star') {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + 13 * Math.cos(a);
      const y = cy + 13 * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      const a2 = a + Math.PI / 5;
      const x2 = cx + 5.5 * Math.cos(a2);
      const y2 = cy + 5.5 * Math.sin(a2);
      ctx.lineTo(x2, y2);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 3, 5, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 5, cy + 12, 8, Math.PI, 0);
    ctx.arc(cx + 5, cy + 12, 8, Math.PI, 0);
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
  ctx.arc(sx, sy, 26, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(a) * 30, sy + Math.sin(a) * 30);
    ctx.lineTo(sx + Math.cos(a) * 38, sy + Math.sin(a) * 38);
    ctx.stroke();
  }
  // Horizon line
  ctx.beginPath();
  ctx.moveTo(sx - 34, sy + 3);
  ctx.lineTo(sx + 34, sy + 3);
  ctx.stroke();
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

function drawPalmTree(ctx, px, py, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3.5;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(px, py + 12);
  ctx.quadraticCurveTo(px + 4, py, px - 2, py - 12);
  ctx.stroke();

  // Leaves
  const tx = px - 2, ty = py - 12;
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 12, ty - 6, tx - 18, ty + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 8, ty - 14, tx - 12, ty - 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 12, ty - 6, tx + 18, ty + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 8, ty - 14, tx + 12, ty - 18); ctx.stroke();

  // Waves
  ctx.lineWidth = 2;
  for (let i = 0; i < 2; i++) {
    const wy = py + 16 + i * 5;
    ctx.beginPath();
    ctx.moveTo(px - 14, wy);
    ctx.quadraticCurveTo(px - 7, wy - 3, px, wy);
    ctx.quadraticCurveTo(px + 7, wy + 3, px + 14, wy);
    ctx.stroke();
  }

  ctx.restore();
}

