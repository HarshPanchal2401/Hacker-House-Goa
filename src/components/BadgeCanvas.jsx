import React, { useRef, useEffect } from 'react';

export default function BadgeCanvas({
  mode,             // 'idcard' | 'pfp'
  photo,            // Data URL string
  builderName,
  handle,
  stackRole,
  teamName,
  zoom,
  panX,
  panY,
  onCanvasReady,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution Canvas Dimensions
    // Badge Pass = 1080 x 1620
    // PFP Overlay = 1080 x 1080
    if (mode === 'pfp') {
      canvas.width = 1080;
      canvas.height = 1080;
    } else {
      canvas.width = 1080;
      canvas.height = 1620;
    }

    const width = canvas.width;
    const height = canvas.height;

    // Brand Colors
    const greenDark = '#043A23';
    const greenDeep = '#06492C';
    const yellowGold = '#FFE500';
    const pinkHot = '#E81A66';
    const creamBg = '#FAF6EA';
    const textGreen = '#063A23';

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (mode === 'pfp') {
      renderExactPfpOverlay();
    } else {
      renderExactCardBadge();
    }

    // --- FORMAT A: EXACT CIRCULAR PFP OVERLAY ---
    function renderExactPfpOverlay() {
      const cx = width / 2;
      const cy = height / 2;

      // 1. Deep Emerald Green Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 600);
      bgGrad.addColorStop(0, '#064B2C');
      bgGrad.addColorStop(1, '#032B1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. User Photo in Center Circular Window (Radius 320)
      const photoRadius = 320;
      const imgObj = new Image();
      if (photo) imgObj.src = photo;
      imgObj.onload = () => drawPfpPhoto(imgObj);
      if (!photo) drawPfpPhoto(null);

      function drawPfpPhoto(userImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
        ctx.clip();

        if (userImg) {
          ctx.translate(cx + panX, cy + panY);
          ctx.scale(zoom, zoom);
          const imgAspect = userImg.width / userImg.height;
          let rW = photoRadius * 2;
          let rH = photoRadius * 2;
          if (imgAspect > 1) {
            rH = photoRadius * 2;
            rW = photoRadius * 2 * imgAspect;
          } else {
            rW = photoRadius * 2;
            rH = (photoRadius * 2) / imgAspect;
          }
          ctx.drawImage(userImg, -rW / 2, -rH / 2, rW, rH);
        } else {
          ctx.fillStyle = '#063620';
          ctx.fillRect(cx - photoRadius, cy - photoRadius, photoRadius * 2, photoRadius * 2);
          ctx.fillStyle = yellowGold;
          ctx.font = '700 28px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('UPLOAD PHOTO FOR PFP', cx, cy);
        }
        ctx.restore();

        // Inner Circle Thin Golden Border around photo
        ctx.strokeStyle = yellowGold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
        ctx.stroke();

        // 3. OUTER CONCENTRIC GOLDEN RINGS
        const outerR1 = 490;
        const outerR2 = 480;

        ctx.strokeStyle = yellowGold;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR2, 0, Math.PI * 2);
        ctx.stroke();

        // 4. TOP CURVED ARC TEXT: HACKER  गोवा  HOUSE (Perfectly centered without overlap)
        const topRadius = 405;

        // Draw "HACKER" (Yellow Serif Arc Top-Left)
        drawTextAlongArcCentered(
          ctx,
          'HACKER',
          cx,
          cy,
          topRadius,
          -124 * (Math.PI / 180),
          '900 54px "Playfair Display", serif',
          yellowGold
        );

        // Draw "गोवा" (Hot Pink Devanagari Arc Top-Center)
        drawTextAlongArcCentered(
          ctx,
          'गोवा',
          cx,
          cy,
          topRadius - 2,
          -90 * (Math.PI / 180),
          'bold 42px "Rozha One", serif',
          pinkHot
        );

        // Draw "HOUSE" (Yellow Serif Arc Top-Right)
        drawTextAlongArcCentered(
          ctx,
          'HOUSE',
          cx,
          cy,
          topRadius,
          -56 * (Math.PI / 180),
          '900 54px "Playfair Display", serif',
          yellowGold
        );

        // 5. BOTTOM CURVED ARC TEXT: ✦  GOA, INDIA  •  28 – 31 OCT 2026  ✦
        const bottomRadius = 422;
        const bottomStr = '✦   GOA, INDIA   •   28  –  31  OCT  2026   ✦';
        drawTextAlongArcCenteredBottom(
          ctx,
          bottomStr,
          cx,
          cy,
          bottomRadius,
          90 * (Math.PI / 180),
          '700 23px "Space Mono", monospace',
          yellowGold,
          pinkHot
        );

        // 6. LEFT & RIGHT ILLUSTRATIONS INSIDE GREEN RING
        // Left Side: Palm Tree 🌴 + Setting Sun 🌅 + Ocean Waves
        drawLeftPfpScenery(ctx, cx, cy);

        // Right Side: Palm Tree 🌴 + Beach Shack with "GOA" sign
        drawRightPfpScenery(ctx, cx, cy);

        if (onCanvasReady) {
          onCanvasReady(canvas.toDataURL('image/png'));
        }
      }
    }

    // --- FORMAT B: EXACT EVENT BADGE PASS ---
    function renderExactCardBadge() {
      const cardMargin = 40;
      const cardW = width - (cardMargin * 2);
      const cardH = height - (cardMargin * 2) - 40;
      const cardX = cardMargin;
      const cardY = cardMargin + 30;

      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 15;

      ctx.fillStyle = greenDark;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 36);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      const innerGrad = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
      innerGrad.addColorStop(0, '#094D2F');
      innerGrad.addColorStop(0.5, '#063E26');
      innerGrad.addColorStop(1, '#042D1C');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 36);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 229, 0, 0.3)';
      ctx.lineWidth = 3;
      ctx.strokeRect(cardX, cardY, cardW, cardH);

      // Lanyard Clip
      const strapW = 110;
      const strapH = 80;
      const strapX = width / 2 - strapW / 2;
      ctx.fillStyle = pinkHot;
      ctx.beginPath();
      ctx.roundRect(strapX, 0, strapW, strapH, [0, 0, 8, 8]);
      ctx.fill();

      ctx.fillStyle = yellowGold;
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🌴', width / 2, 45);

      const clipW = 160;
      const clipH = 40;
      const clipX = width / 2 - clipW / 2;
      const clipY = 65;

      const clipGrad = ctx.createLinearGradient(clipX, clipY, clipX, clipY + clipH);
      clipGrad.addColorStop(0, '#E6E6E6');
      clipGrad.addColorStop(0.5, '#999999');
      clipGrad.addColorStop(1, '#666666');

      ctx.strokeStyle = clipGrad;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.roundRect(clipX, clipY, clipW, clipH, 14);
      ctx.stroke();

      ctx.fillStyle = '#1A1A1A';
      ctx.beginPath();
      ctx.roundRect(clipX + 15, clipY + 6, clipW - 30, clipH - 12, 8);
      ctx.fill();

      // Header
      const headerY = 190;
      ctx.fillStyle = yellowGold;
      ctx.font = '900 76px "Playfair Display", serif';
      ctx.textAlign = 'left';
      ctx.fillText('HACKER', cardX + 50, headerY);

      ctx.textAlign = 'right';
      ctx.fillText('HOUSE', cardX + cardW - 50, headerY);

      // Devanagari Stamp
      const stampX = width / 2;
      const stampY = headerY - 26;

      ctx.save();
      ctx.fillStyle = pinkHot;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(stampX - 55, stampY - 38, 110, 52, 10);
      ctx.fill();

      ctx.strokeStyle = yellowGold;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 30px "Rozha One", serif';
      ctx.textAlign = 'center';
      ctx.fillText('गोवा', stampX, stampY + 0);
      ctx.restore();

      ctx.fillStyle = yellowGold;
      ctx.font = '700 22px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GOA, INDIA   •   28  –  31  OCT  2026', width / 2, headerY + 45);

      // Sunburst Rays
      ctx.strokeStyle = yellowGold;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cardX + 45, headerY - 50); ctx.lineTo(cardX + 30, headerY - 70);
      ctx.moveTo(cardX + 65, headerY - 60); ctx.lineTo(cardX + 55, headerY - 82);
      ctx.moveTo(cardX + 85, headerY - 65); ctx.lineTo(cardX + 80, headerY - 88);
      ctx.moveTo(cardX + cardW - 45, headerY + 50); ctx.lineTo(cardX + cardW - 30, headerY + 70);
      ctx.moveTo(cardX + cardW - 65, headerY + 60); ctx.lineTo(cardX + cardW - 55, headerY + 82);
      ctx.moveTo(cardX + cardW - 85, headerY + 65); ctx.lineTo(cardX + cardW - 80, headerY + 88);
      ctx.stroke();

      // Scenery
      drawPalmTrees(ctx, cardX, cardY, cardW, cardH);
      drawBeachScenery(ctx, cardX, cardY, cardW, cardH);

      // User Photo Box
      const photoW = 540;
      const photoH = 460;
      const photoX = width / 2 - photoW / 2;
      const photoY = 310;
      const photoRadius = 32;

      const imgObj = new Image();
      if (photo) imgObj.src = photo;
      imgObj.onload = () => drawPhotoContent(imgObj);
      if (!photo) drawPhotoContent(null);

      function drawPhotoContent(userImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
        ctx.clip();

        if (userImg) {
          const centerX = photoX + photoW / 2;
          const centerY = photoY + photoH / 2;
          ctx.translate(centerX + panX, centerY + panY);
          ctx.scale(zoom, zoom);

          const imgAspect = userImg.width / userImg.height;
          const frameAspect = photoW / photoH;
          let renderW = photoW;
          let renderH = photoH;

          if (imgAspect > frameAspect) {
            renderH = photoH;
            renderW = photoH * imgAspect;
          } else {
            renderW = photoW;
            renderH = photoW / imgAspect;
          }

          ctx.drawImage(userImg, -renderW / 2, -renderH / 2, renderW, renderH);
        } else {
          ctx.fillStyle = '#063620';
          ctx.fillRect(photoX, photoY, photoW, photoH);
          ctx.fillStyle = yellowGold;
          ctx.font = '700 24px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('CLICK OR DROP YOUR PHOTO', width / 2, photoY + photoH / 2);
        }
        ctx.restore();

        // Hot Pink Border
        ctx.strokeStyle = pinkHot;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
        ctx.stroke();

        renderCreamBuilderBox();
      }

      function renderCreamBuilderBox() {
        const boxX = cardX + 110;
        const boxY = 810;
        const boxW = cardW - 220;
        const boxH = 460;
        const boxRadius = 30;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;

        ctx.fillStyle = creamBg;
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, boxRadius);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        const rowLeftX = boxX + 40;
        const iconRadius = 32;

        // ROW 1: NAME
        const row1Y = boxY + 70;
        drawHotPinkIconCircle(ctx, rowLeftX + iconRadius, row1Y, 'user');
        ctx.textAlign = 'left';
        ctx.fillStyle = textGreen;
        ctx.font = '700 16px "Space Mono", monospace';
        ctx.fillText('NAME', rowLeftX + 80, row1Y - 14);
        ctx.fillStyle = textGreen;
        ctx.font = '900 38px "Playfair Display", serif';
        ctx.fillText((builderName || 'HARSH PATIL').toUpperCase(), rowLeftX + 80, row1Y + 22);
        drawDashedLine(ctx, rowLeftX, row1Y + 46, boxX + 480, row1Y + 46);

        // ROW 2: ROLE
        const row2Y = row1Y + 120;
        drawHotPinkIconCircle(ctx, rowLeftX + iconRadius, row2Y, 'briefcase');
        ctx.fillStyle = textGreen;
        ctx.font = '700 16px "Space Mono", monospace';
        ctx.fillText('ROLE', rowLeftX + 80, row2Y - 14);
        ctx.fillStyle = pinkHot;
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText((stackRole || 'AI/ML ENGINEER').toUpperCase(), rowLeftX + 80, row2Y + 20);
        drawDashedLine(ctx, rowLeftX, row2Y + 46, boxX + 480, row2Y + 46);

        // ROW 3: TEAM NAME
        const row3Y = row2Y + 120;
        drawHotPinkIconCircle(ctx, rowLeftX + iconRadius, row3Y, 'team');
        ctx.fillStyle = textGreen;
        ctx.font = '700 16px "Space Mono", monospace';
        ctx.fillText('TEAM NAME', rowLeftX + 80, row3Y - 14);
        ctx.fillStyle = pinkHot;
        ctx.font = '700 28px "Space Mono", monospace';
        ctx.fillText((teamName || handle || 'CODE SAILOR').toUpperCase().replace('@', ''), rowLeftX + 80, row3Y + 20);

        // Accents
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#D9CFBB';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(boxX + 530, boxY + 40);
        ctx.lineTo(boxX + 530, boxY + boxH - 40);
        ctx.stroke();
        ctx.setLineDash([]);

        drawSettingSunOnCreamCard(ctx, boxX + 630, boxY + 140);
        drawAnchorIcon(ctx, boxX + 650, boxY + 360, pinkHot);

        // Yellow Banner Strip
        const stripH = 110;
        const stripY = cardY + cardH - stripH;

        ctx.fillStyle = yellowGold;
        ctx.beginPath();
        ctx.roundRect(cardX, stripY, cardW, stripH, [0, 0, 36, 36]);
        ctx.fill();

        ctx.fillStyle = textGreen;
        ctx.font = '700 26px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('🌴  BUILD. SHIP. REPEAT.', cardX + 40, stripY + 55);
        ctx.textAlign = 'right';
        ctx.fillText('#FrameInGoa', cardX + cardW - 40, stripY + 55);
        ctx.textAlign = 'center';
        ctx.fillText('|', cardX + cardW - 270, stripY + 55);

        drawWovenPatternStrip(ctx, cardX, stripY + stripH - 24, cardW, 24);

        if (onCanvasReady) {
          onCanvasReady(canvas.toDataURL('image/png'));
        }
      }
    }
  }, [
    mode,
    photo,
    builderName,
    handle,
    stackRole,
    teamName,
    zoom,
    panX,
    panY,
    onCanvasReady,
  ]);

  return (
    <div className="w-full flex justify-center">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#FFE500]/30 max-w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-auto max-h-[78vh] object-contain rounded-xl bg-[#064228]"
        />
      </div>
    </div>
  );
}

// --- CURVED ARC TEXT HELPER FUNCTIONS FOR PFP OVERLAY ---

function drawTextAlongArcCentered(ctx, text, cx, cy, radius, centerAngle, font, color) {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.split('');
  const charWidths = chars.map(c => ctx.measureText(c).width * 1.08);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);
  const totalAngle = totalWidth / radius;

  let currentAngle = centerAngle - (totalAngle / 2);

  chars.forEach((char, i) => {
    const charAngle = currentAngle + (charWidths[i] / 2) / radius;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(charAngle), cy + radius * Math.sin(charAngle));
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    currentAngle += charWidths[i] / radius;
  });

  ctx.restore();
}

function drawTextAlongArcCenteredBottom(ctx, text, cx, cy, radius, centerAngle, font, yellowColor, pinkColor) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.split('');
  const charWidths = chars.map(c => ctx.measureText(c).width * 1.08);
  const totalWidth = charWidths.reduce((a, b) => a + b, 0);
  const totalAngle = totalWidth / radius;

  let currentAngle = centerAngle + (totalAngle / 2);

  chars.forEach((char, i) => {
    const charAngle = currentAngle - (charWidths[i] / 2) / radius;
    ctx.save();
    ctx.translate(cx + radius * Math.cos(charAngle), cy + radius * Math.sin(charAngle));
    ctx.rotate(charAngle - Math.PI / 2);

    if (char === '✦') {
      ctx.fillStyle = pinkColor;
    } else {
      ctx.fillStyle = yellowColor;
    }

    ctx.fillText(char, 0, 0);
    ctx.restore();

    currentAngle -= charWidths[i] / radius;
  });

  ctx.restore();
}

function drawLeftPfpScenery(ctx, cx, cy) {
  ctx.save();
  const lx = cx - 390;
  const ly = cy + 40;

  // Left Palm Tree
  ctx.strokeStyle = '#FFE500';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#064B2C';

  ctx.beginPath();
  ctx.moveTo(lx, ly + 140);
  ctx.quadraticCurveTo(lx + 20, ly + 60, lx, ly - 40);
  ctx.stroke();

  // Fronds
  for (let i = 0; i < 5; i++) {
    const a = (i * 70 * Math.PI) / 180 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(lx + Math.cos(a) * 30, ly - 40 + Math.sin(a) * 30, 35, 12, a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Setting Sun 🌅
  ctx.fillStyle = '#FFE500';
  ctx.beginPath();
  ctx.arc(lx + 50, ly + 70, 20, Math.PI, 0);
  ctx.fill();

  // Ocean Waves
  ctx.strokeStyle = '#FFE500';
  ctx.lineWidth = 2;
  for (let y = ly + 75; y <= ly + 115; y += 12) {
    ctx.beginPath();
    ctx.moveTo(lx + 20, y);
    ctx.quadraticCurveTo(lx + 50, y - 5, lx + 80, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawRightPfpScenery(ctx, cx, cy) {
  ctx.save();
  const rx = cx + 390;
  const ry = cy + 40;

  // Right Palm Tree
  ctx.strokeStyle = '#FFE500';
  ctx.lineWidth = 3;
  ctx.fillStyle = '#064B2C';

  ctx.beginPath();
  ctx.moveTo(rx, ry + 140);
  ctx.quadraticCurveTo(rx - 20, ry + 60, rx, ry - 40);
  ctx.stroke();

  // Fronds
  for (let i = 0; i < 5; i++) {
    const a = (i * 70 * Math.PI) / 180 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(rx + Math.cos(a) * 30, ry - 40 + Math.sin(a) * 30, 35, 12, a, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Beach Shack with GOA sign
  const sx = rx - 80;
  const sy = ry + 60;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(sx, sy, 55, 45);
  ctx.strokeStyle = '#FFE500';
  ctx.lineWidth = 2;
  ctx.strokeRect(sx, sy, 55, 45);

  // Roof
  ctx.fillStyle = '#E81A66';
  ctx.beginPath();
  ctx.moveTo(sx - 5, sy);
  ctx.lineTo(sx + 27, sy - 15);
  ctx.lineTo(sx + 60, sy);
  ctx.fill();

  // GOA sign
  ctx.fillStyle = '#FFE500';
  ctx.font = 'bold 9px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GOA', sx + 27, sy - 3);

  ctx.restore();
}

// --- HELPER DRAWING FUNCTIONS FOR CARD BADGE ---

function drawHotPinkIconCircle(ctx, cx, cy, type) {
  ctx.fillStyle = '#E81A66';
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;

  if (type === 'user') {
    ctx.beginPath();
    ctx.arc(cx, cy - 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 16, 15, Math.PI, 0);
    ctx.fill();
  } else if (type === 'briefcase') {
    ctx.fillRect(cx - 12, cy - 5, 24, 16);
    ctx.strokeRect(cx - 6, cy - 10, 12, 5);
  } else {
    ctx.beginPath();
    ctx.arc(cx - 6, cy - 4, 6, 0, Math.PI * 2);
    ctx.arc(cx + 6, cy - 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx - 6, cy + 14, 11, Math.PI, 0);
    ctx.arc(cx + 6, cy + 14, 11, Math.PI, 0);
    ctx.fill();
  }
}

function drawDashedLine(ctx, x1, y1, x2, y2) {
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#D9CFBB';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function drawPalmTrees(ctx, cardX, cardY, cardW, cardH) {
  ctx.save();
  ctx.strokeStyle = '#05311D';
  ctx.fillStyle = '#064B2C';
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.moveTo(cardX + 20, cardY + 800);
  ctx.quadraticCurveTo(cardX + 80, cardY + 500, cardX + 40, cardY + 300);
  ctx.stroke();

  drawFronds(ctx, cardX + 40, cardY + 300);

  ctx.beginPath();
  ctx.moveTo(cardX + cardW - 20, cardY + 850);
  ctx.quadraticCurveTo(cardX + cardW - 90, cardY + 550, cardX + cardW - 30, cardY + 320);
  ctx.stroke();

  drawFronds(ctx, cardX + cardW - 30, cardY + 320);
  ctx.restore();
}

function drawFronds(ctx, fx, fy) {
  ctx.fillStyle = '#0B633B';
  ctx.strokeStyle = '#FFE500';
  ctx.lineWidth = 2;

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180;
    ctx.beginPath();
    ctx.ellipse(fx + Math.cos(angle) * 40, fy + Math.sin(angle) * 40, 50, 16, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function drawBeachScenery(ctx, cardX, cardY, cardW, cardH) {
  ctx.save();
  const bottomY = cardY + cardH - 220;

  ctx.strokeStyle = 'rgba(255, 229, 0, 0.4)';
  ctx.lineWidth = 2;
  for (let y = bottomY - 180; y < bottomY; y += 40) {
    ctx.beginPath();
    ctx.moveTo(cardX + 60, y);
    ctx.quadraticCurveTo(cardX + 120, y - 10, cardX + 180, y);
    ctx.quadraticCurveTo(cardX + 240, y + 10, cardX + 300, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#F4EACE';
  ctx.beginPath();
  ctx.ellipse(cardX + cardW / 2, bottomY + 60, cardW / 2 - 20, 90, 0, 0, Math.PI * 2);
  ctx.fill();

  const shackX = cardX + cardW - 280;
  const shackY = bottomY - 60;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(shackX, shackY, 140, 100);
  ctx.strokeStyle = '#063A23';
  ctx.lineWidth = 3;
  ctx.strokeRect(shackX, shackY, 140, 100);

  ctx.fillStyle = '#E81A66';
  ctx.beginPath();
  ctx.moveTo(shackX - 10, shackY);
  ctx.lineTo(shackX + 70, shackY - 35);
  ctx.lineTo(shackX + 150, shackY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#E81A66';
  ctx.fillRect(shackX + 15, shackY - 22, 110, 24);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GOA BEACH', shackX + 70, shackY - 6);

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(shackX - 30, shackY + 40, 12, 45, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFE500';
  ctx.beginPath();
  ctx.ellipse(shackX - 10, shackY + 40, 12, 45, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawSettingSunOnCreamCard(ctx, sx, sy) {
  ctx.save();
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.arc(sx, sy, 40, Math.PI, 0);
  ctx.fill();

  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 5; i++) {
    const a = Math.PI + (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(a) * 45, sy + Math.sin(a) * 45);
    ctx.lineTo(sx + Math.cos(a) * 60, sy + Math.sin(a) * 60);
    ctx.stroke();
  }

  ctx.strokeStyle = '#E81A66';
  ctx.beginPath();
  ctx.moveTo(sx - 50, sy);
  ctx.lineTo(sx + 50, sy);
  ctx.moveTo(sx - 40, sy + 8);
  ctx.lineTo(sx + 40, sy + 8);
  ctx.stroke();
  ctx.restore();
}

function drawAnchorIcon(ctx, ax, ay, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.arc(ax, ay - 24, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(ax, ay - 17);
  ctx.lineTo(ax, ay + 20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(ax - 14, ay - 6);
  ctx.lineTo(ax + 14, ay - 6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ax, ay + 6, 22, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawWovenPatternStrip(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#B21E1E';
  ctx.fillRect(x, y, w, h);

  ctx.fillStyle = '#FFE500';
  const size = 12;
  for (let i = x; i < x + w; i += size * 2) {
    ctx.beginPath();
    ctx.moveTo(i, y + h / 2);
    ctx.lineTo(i + size, y);
    ctx.lineTo(i + size * 2, y + h / 2);
    ctx.lineTo(i + size, y + h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
