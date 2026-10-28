import { Obstacle, ThemeColors } from './types';

// Helper to draw rounded rectangle in canvas
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws Family 1: Le logo générique
 * Uncorrected: Awkward clipart / dull swoosh / lopsided star
 * Corrected: Clean, balanced geometric insignia in Violet Impérial with Or Champagne accent
 */
function drawGenericLogo(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  colors: ThemeColors,
  isDarkTheme: boolean
) {
  const { x, y, width: w, height: h, correctionProgress: cp, variant } = obs;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const radius = Math.min(w, h) * 0.46;

  ctx.save();

  // Subtle contrast outline for all background shades
  const outlineColor = isDarkTheme ? 'rgba(255, 255, 255, 0.25)' : 'rgba(13, 10, 24, 0.2)';

  if (cp < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - cp;

    // DULL / CHEESY LOGO
    const dullBase = isDarkTheme ? '#8A859E' : '#726D85';
    const dullAccent = isDarkTheme ? '#A09BB5' : '#5A556E';

    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 1;

    if (variant === 0) {
      // Cliché globe with clumsy tilted swoosh
      ctx.fillStyle = dullBase;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheesy swoosh ring
      ctx.strokeStyle = dullAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.1, radius * 0.35, -0.45, 0, Math.PI * 2);
      ctx.stroke();
    } else if (variant === 1) {
      // Lopsided, clumsy 5-point star
      ctx.fillStyle = dullBase;
      ctx.beginPath();
      const points = 5;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? radius : radius * 0.42;
        // deliberate awkward skew
        const angle = (i * Math.PI) / points - Math.PI / 2 + (i === 3 ? 0.2 : 0);
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Clumsy hexagon with uneven inner lines
      ctx.fillStyle = dullBase;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + Math.cos(angle) * radius * (i === 2 ? 0.8 : 1);
        const py = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Awkward inner cross
      ctx.strokeStyle = dullAccent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.4, cy);
      ctx.lineTo(cx + radius * 0.5, cy);
      ctx.moveTo(cx, cy - radius * 0.5);
      ctx.lineTo(cx + 2, cy + radius * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }

  // CORRECTED STATE: Crisp geometric insignia in Violet Impérial with Or Champagne accent
  if (cp > 0) {
    ctx.save();
    ctx.globalAlpha = cp;

    // Outer refined diamond / rounded badge
    ctx.fillStyle = colors.violetImperial;
    ctx.shadowColor = 'rgba(102, 0, 204, 0.35)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.88, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Or Champagne crisp geometric core
    ctx.fillStyle = colors.orChampagne;
    ctx.beginPath();
    // Elegant nested diamond
    ctx.moveTo(cx, cy - radius * 0.48);
    ctx.lineTo(cx + radius * 0.48, cy);
    ctx.lineTo(cx, cy + radius * 0.48);
    ctx.lineTo(cx - radius * 0.48, cy);
    ctx.closePath();
    ctx.fill();

    // Subtle white inner ring accent
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws Family 2: L'image floue / pixellisée
 * Uncorrected: Visible chunky pixel blocks, pixelated edges
 * Corrected: Resolves into a smooth, glossy card with Améthyste gradients
 */
function drawBlurryImage(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  colors: ThemeColors,
  isDarkTheme: boolean
) {
  const { x, y, width: w, height: h, correctionProgress: cp } = obs;

  ctx.save();

  if (cp < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - cp;

    // Chunky pixel grid (5 columns x 4 rows)
    const cols = 5;
    const rows = 4;
    const pw = w / cols;
    const ph = h / rows;

    // Palette of posterized low-res colors
    const pixelShadesLight = ['#7F7899', '#9E97B8', '#5D5675', '#B8B2D1', '#47415E'];
    const pixelShadesDark = ['#A8A0C2', '#8982A3', '#C5BFDF', '#736B8E', '#5B5475'];
    const shades = isDarkTheme ? pixelShadesDark : pixelShadesLight;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const colorIdx = (r * 3 + c * 2 + (r % 2)) % shades.length;
        ctx.fillStyle = shades[colorIdx];
        ctx.fillRect(x + c * pw, y + r * ph, pw, ph);

        // Visible pixel grid lines
        ctx.strokeStyle = isDarkTheme ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + c * pw, y + r * ph, pw, ph);
      }
    }

    // Rough jagged border
    ctx.strokeStyle = isDarkTheme ? 'rgba(255,255,255,0.3)' : 'rgba(13,10,24,0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  }

  // CORRECTED STATE: Smooth high-definition card with Améthyste gradient and crisp gloss
  if (cp > 0) {
    ctx.save();
    ctx.globalAlpha = cp;

    // Smooth rounded card
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, colors.amethyste);
    grad.addColorStop(0.5, colors.violetImperial);
    grad.addColorStop(1, colors.ardoise);

    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(168, 127, 232, 0.4)';
    ctx.shadowBlur = 8;
    roundedRect(ctx, x, y, w, h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Gloss shine line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 4);
    ctx.lineTo(x + w * 0.75, y + 4);
    ctx.lineTo(x + w * 0.45, y + h * 0.4);
    ctx.lineTo(x + 4, y + h * 0.4);
    ctx.closePath();
    ctx.fill();

    // High-res border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    roundedRect(ctx, x, y, w, h, 6);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws Family 3: Les lettres illisibles
 * Uncorrected: Tangled, incompatible, misaligned glyph fragments overlapping awkwardly
 * Corrected: Straightens and unifies into a single majestic serif letter "S" in Cormorant Garamond
 */
function drawTangledLetters(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  colors: ThemeColors,
  isDarkTheme: boolean
) {
  const { x, y, width: w, height: h, correctionProgress: cp } = obs;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.save();

  if (cp < 1) {
    ctx.save();
    ctx.globalAlpha = 1 - cp;

    const textColor = isDarkTheme ? '#D1CCE6' : '#3E3757';
    const subColor = isDarkTheme ? '#9A92B8' : '#6A6285';

    // Tangled mismatched glyph strokes and fragmented shapes
    // Fragment 1: Awkward tilted sans serif arm
    ctx.save();
    ctx.translate(cx - 8, cy - 4);
    ctx.rotate(-0.35);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 26px "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('z', 0, 0);
    ctx.restore();

    // Fragment 2: Overlapping thick serif slab fragment
    ctx.save();
    ctx.translate(cx + 6, cy - 6);
    ctx.rotate(0.42);
    ctx.fillStyle = subColor;
    ctx.font = 'italic 30px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('k', 0, 0);
    ctx.restore();

    // Fragment 3: Tangled loop at the bottom
    ctx.save();
    ctx.translate(cx, cy + 8);
    ctx.rotate(-0.18);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('&', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  // CORRECTED STATE: Beautiful, crisp letter "S" in Cormorant Garamond
  if (cp > 0) {
    ctx.save();
    ctx.globalAlpha = cp;

    // Glowing backing badge
    ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(102, 0, 204, 0.08)';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.48, 0, Math.PI * 2);
    ctx.fill();

    // Elegant serif 'S'
    ctx.fillStyle = isDarkTheme ? '#FFFFFF' : colors.violetImperial;
    ctx.font = '600 38px "Cormorant Garamond", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Scale up slightly during transition
    const scale = 0.85 + cp * 0.15;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.fillText('S', 0, 2);

    // Or Champagne subtle dot accent
    ctx.fillStyle = colors.orChampagne;
    ctx.beginPath();
    ctx.arc(12, -12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Master dispatcher for drawing any obstacle
 */
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  colors: ThemeColors,
  isDarkTheme: boolean
) {
  switch (obs.family) {
    case 'generic_logo':
      drawGenericLogo(ctx, obs, colors, isDarkTheme);
      break;
    case 'blurry_image':
      drawBlurryImage(ctx, obs, colors, isDarkTheme);
      break;
    case 'tangled_letters':
      drawTangledLetters(ctx, obs, colors, isDarkTheme);
      break;
  }
}
