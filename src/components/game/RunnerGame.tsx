import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Home, Sparkles } from 'lucide-react';
import { GameState, Obstacle, Particle, FallingDigit, ThemeColors } from './types';
import { drawObstacle } from './obstacles';
import { gameAudio } from '../../lib/gameAudio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const LOCAL_STORAGE_KEY = 'classs-runner-record';

// Interpolate between two hex colors
function lerpHex(color1: string, color2: string, t: number): string {
  const c1 = parseInt(color1.replace('#', ''), 16);
  const c2 = parseInt(color2.replace('#', ''), 16);

  const r1 = (c1 >> 16) & 255;
  const g1 = (c1 >> 8) & 255;
  const b1 = c1 & 255;

  const r2 = (c2 >> 16) & 255;
  const g2 = (c2 >> 8) & 255;
  const b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

export const RunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const replayBtnRef = useRef<HTMLButtonElement | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const [gameState, setGameState] = useState<GameState>('intro');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [accessibilityAnnouncement, setAccessibilityAnnouncement] = useState('');

  // Sprites
  const purpleDropImg = useRef<HTMLImageElement | null>(null);
  const whiteDropImg = useRef<HTMLImageElement | null>(null);

  // Theme colors read from CSS root variables
  const colorsRef = useRef<ThemeColors>({
    violetImperial: '#6600CC',
    orChampagne: '#C9A070',
    amethyste: '#A87FE8',
    ivoireViolet: '#F8F5FF',
    ardoise: '#3A2F5C',
    onyx: '#0D0A18',
  });

  // Game loop engine variables (kept in ref for 60/120fps delta-time independence)
  const engine = useRef({
    state: 'intro' as GameState,
    lastTime: 0,
    elapsedIntro: 0,
    speed: 260, // initial speed px/s
    distance: 0,
    drop: {
      x: 70,
      y: 0,
      baseY: 0,
      vy: 0,
      width: 34,
      height: 51,
      isGrounded: true,
      scaleX: 1,
      scaleY: 1,
      bobTime: 0,
    },
    digits: [] as FallingDigit[],
    obstacles: [] as Obstacle[],
    nextObstacleDistance: 400,
    particles: [] as Particle[],
    screenShake: 0,
    darknessRatio: 0, // 0 = ivoire, 0.5 = ardoise, 1.0 = onyx
    groundY: 220,
    width: 800,
    height: 280,
  });

  // Load record from localStorage with try/catch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {}

    // Detect touch device
    if (typeof window !== 'undefined') {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }
  }, []);

  // Read theme colors from root CSS variables
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const style = getComputedStyle(document.documentElement);
    colorsRef.current = {
      violetImperial: style.getPropertyValue('--color-violet-imperial').trim() || '#6600CC',
      orChampagne: style.getPropertyValue('--color-or-champagne').trim() || '#C9A070',
      amethyste: style.getPropertyValue('--color-amethyste').trim() || '#A87FE8',
      ivoireViolet: style.getPropertyValue('--color-ivoire-violet').trim() || '#F8F5FF',
      ardoise: style.getPropertyValue('--color-ardoise').trim() || '#3A2F5C',
      onyx: style.getPropertyValue('--color-onyx').trim() || '#0D0A18',
    };
  }, []);

  // Preload drop sprites
  useEffect(() => {
    const imgPurple = new Image();
    imgPurple.src = '/assets/game/drop-purple.png';
    purpleDropImg.current = imgPurple;

    const imgWhite = new Image();
    imgWhite.src = '/assets/game/drop-white.png';
    whiteDropImg.current = imgWhite;
  }, []);

  // Audio toggle
  const toggleSound = () => {
    const newState = gameAudio.toggle();
    setSoundOn(newState);
  };

  // Jump trigger
  const jump = useCallback(() => {
    const eng = engine.current;
    if (eng.state === 'ready') {
      eng.state = 'running';
      setGameState('running');
      eng.lastTime = performance.now();
    }

    if (eng.state !== 'running') return;

    if (eng.drop.isGrounded) {
      // Jump parameters: air time ~0.58s, jump height ~88px
      const jumpHeight = 88;
      const airTime = 0.58;
      const g = (8 * jumpHeight) / (airTime * airTime);
      eng.drop.vy = -Math.sqrt(2 * g * jumpHeight);
      eng.drop.isGrounded = false;
      eng.drop.scaleY = 1.18;
      eng.drop.scaleX = 0.88;

      gameAudio.playJump();
    }
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    const eng = engine.current;
    eng.state = 'running';
    eng.speed = 260;
    eng.distance = 0;
    eng.darknessRatio = 0;
    eng.obstacles = [];
    eng.particles = [];
    eng.screenShake = 0;
    eng.drop.y = eng.drop.baseY;
    eng.drop.vy = 0;
    eng.drop.isGrounded = true;
    eng.drop.scaleX = 1;
    eng.drop.scaleY = 1;
    eng.nextObstacleDistance = 320;
    eng.lastTime = performance.now();

    setScore(0);
    setIsNewHigh(false);
    setGameState('running');
  }, []);

  // Handle Game Over
  const triggerGameOver = useCallback((finalScore: number) => {
    const eng = engine.current;
    eng.state = 'gameover';
    setGameState('gameover');

    // Droplet splash particles
    const dropCenterX = eng.drop.x + eng.drop.width / 2;
    const dropCenterY = eng.drop.y + eng.drop.height / 2;

    const splashColor = eng.darknessRatio > 0.45 ? '#FFFFFF' : colorsRef.current.violetImperial;
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 160 + 60;
      eng.particles.push({
        x: dropCenterX,
        y: dropCenterY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60,
        radius: Math.random() * 3 + 2,
        color: splashColor,
        alpha: 1,
        life: 0,
        maxLife: 0.55,
      });
    }

    if (!prefersReducedMotion) {
      eng.screenShake = 8;
    }

    gameAudio.playCrash();

    // Check & persist high score
    let isRecord = false;
    try {
      const currentRecord = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY) || '0', 10);
      if (finalScore > currentRecord) {
        localStorage.setItem(LOCAL_STORAGE_KEY, finalScore.toString());
        setHighScore(finalScore);
        setIsNewHigh(true);
        isRecord = true;
      }
    } catch {}

    // Accessibility announcement
    setAccessibilityAnnouncement(
      `Partie terminée. Score : ${finalScore}. Record : ${isRecord ? finalScore : highScore}.`
    );

    // Focus replay button
    setTimeout(() => {
      replayBtnRef.current?.focus();
    }, 200);
  }, [highScore, prefersReducedMotion]);

  // Main Canvas Animation and Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const displayWidth = Math.max(rect.width, 320);
      // Adaptive aspect ratio: slightly taller on mobile screens
      const isMobile = displayWidth < 640;
      const displayHeight = isMobile ? Math.min(displayWidth * 0.65, 340) : Math.min(displayWidth * 0.38, 300);

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const eng = engine.current;
      eng.width = displayWidth;
      eng.height = displayHeight;
      eng.groundY = displayHeight - 50;
      eng.drop.baseY = eng.groundY - eng.drop.height;
      if (eng.drop.isGrounded) {
        eng.drop.y = eng.drop.baseY;
      }

      // Initialize or update 404 falling digits layout
      if (eng.digits.length === 0) {
        const spacing = displayWidth < 480 ? 64 : 100;
        const centerX = displayWidth / 2;
        eng.digits = [
          {
            char: '4',
            x: centerX - spacing,
            y: -120,
            targetY: eng.groundY - 14,
            vy: 0,
            delay: prefersReducedMotion ? 0 : 40,
            bounces: 0,
            settled: prefersReducedMotion,
          },
          {
            char: '0',
            x: centerX,
            y: -120,
            targetY: eng.groundY - 14,
            vy: 0,
            delay: prefersReducedMotion ? 0 : 170,
            bounces: 0,
            settled: prefersReducedMotion,
          },
          {
            char: '4',
            x: centerX + spacing,
            y: -120,
            targetY: eng.groundY - 14,
            vy: 0,
            delay: prefersReducedMotion ? 0 : 300,
            bounces: 0,
            settled: prefersReducedMotion,
          },
        ];

        // Drop initial position during intro
        if (prefersReducedMotion) {
          eng.drop.y = eng.drop.baseY;
          eng.drop.isGrounded = true;
          eng.state = 'ready';
          setGameState('ready');
        } else {
          eng.drop.y = -60;
          eng.drop.vy = 0;
          eng.drop.isGrounded = false;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Visibility change auto-pause
    const handleVisibility = () => {
      if (document.hidden && engine.current.state === 'running') {
        engine.current.state = 'ready';
        setGameState('ready');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    engine.current.lastTime = performance.now();

    // ----------------------------------------------------
    // Loop Step
    // ----------------------------------------------------
    const loop = (now: number) => {
      const eng = engine.current;
      const dt = Math.min((now - eng.lastTime) / 1000, 0.1); // clamp delta time
      eng.lastTime = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Shake effect
      if (eng.screenShake > 0) {
        const sx = (Math.random() - 0.5) * eng.screenShake;
        const sy = (Math.random() - 0.5) * eng.screenShake;
        ctx.translate(sx, sy);
        eng.screenShake = Math.max(0, eng.screenShake - dt * 25);
      }

      // 2. Background color interpolation
      // 0.0 -> Ivoire Violet (#F8F5FF)
      // 0.5 -> Ardoise (#3A2F5C)
      // 1.0 -> Onyx (#0D0A18)
      let bgColor = colorsRef.current.ivoireViolet;
      if (eng.darknessRatio <= 0.5) {
        bgColor = lerpHex(colorsRef.current.ivoireViolet, colorsRef.current.ardoise, eng.darknessRatio * 2);
      } else {
        bgColor = lerpHex(colorsRef.current.ardoise, colorsRef.current.onyx, (eng.darknessRatio - 0.5) * 2);
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, eng.width, eng.height);

      const isDarkTheme = eng.darknessRatio > 0.45;

      // ----------------------------------------------------
      // INTRO STATE: 404 Numbers Fall & Drop Emerges
      // ----------------------------------------------------
      if (eng.state === 'intro') {
        eng.elapsedIntro += dt * 1000;

        let allDigitsSettled = true;
        eng.digits.forEach((digit) => {
          if (eng.elapsedIntro >= digit.delay) {
            if (!digit.settled) {
              digit.vy += 1800 * dt; // gravity
              digit.y += digit.vy * dt;

              if (digit.y >= digit.targetY) {
                digit.y = digit.targetY;
                digit.bounces++;
                if (digit.bounces < 2) {
                  digit.vy = -digit.vy * 0.32; // small bounce
                } else {
                  digit.vy = 0;
                  digit.settled = true;
                }
              }
            }
          }
          if (!digit.settled) allDigitsSettled = false;
        });

        // Drop falls and lands after digits settle
        if (eng.elapsedIntro >= 550) {
          eng.drop.vy += 1400 * dt;
          eng.drop.y += eng.drop.vy * dt;

          if (eng.drop.y >= eng.drop.baseY) {
            eng.drop.y = eng.drop.baseY;
            eng.drop.vy = 0;
            eng.drop.isGrounded = true;
            eng.drop.scaleY = 0.82;
            eng.drop.scaleX = 1.18;

            if (allDigitsSettled) {
              eng.state = 'ready';
              setGameState('ready');
            }
          }
        }
      }

      // ----------------------------------------------------
      // DRAW 404 WATERMARK
      // ----------------------------------------------------
      ctx.save();
      const watermarkColor = isDarkTheme ? 'rgba(248, 245, 255, 0.08)' : 'rgba(102, 0, 204, 0.08)';
      ctx.fillStyle = watermarkColor;
      ctx.font = '700 110px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      eng.digits.forEach((digit) => {
        ctx.fillText(digit.char, digit.x, digit.settled ? eng.groundY - 10 : digit.y);
      });
      ctx.restore();

      // ----------------------------------------------------
      // DRAW GROUND TRACK
      // ----------------------------------------------------
      ctx.save();
      ctx.strokeStyle = isDarkTheme ? 'rgba(248, 245, 255, 0.25)' : 'rgba(102, 0, 204, 0.18)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, eng.groundY);
      ctx.lineTo(eng.width, eng.groundY);
      ctx.stroke();

      // Subtle track dashes moving with speed
      if (eng.state === 'running') {
        ctx.strokeStyle = isDarkTheme ? 'rgba(248, 245, 255, 0.12)' : 'rgba(102, 0, 204, 0.1)';
        ctx.lineWidth = 1;
        const dashOffset = (eng.distance * 1.5) % 24;
        ctx.setLineDash([8, 16]);
        ctx.lineDashOffset = -dashOffset;
        ctx.beginPath();
        ctx.moveTo(0, eng.groundY + 8);
        ctx.lineTo(eng.width, eng.groundY + 8);
        ctx.stroke();
      }
      ctx.restore();

      // ----------------------------------------------------
      // RUNNING STATE: Physics & Spawning
      // ----------------------------------------------------
      if (eng.state === 'running') {
        // Drop physics
        if (!eng.drop.isGrounded) {
          const jumpHeight = 88;
          const airTime = 0.58;
          const g = (8 * jumpHeight) / (airTime * airTime);
          eng.drop.vy += g * dt;
          eng.drop.y += eng.drop.vy * dt;

          if (eng.drop.y >= eng.drop.baseY) {
            eng.drop.y = eng.drop.baseY;
            eng.drop.vy = 0;
            eng.drop.isGrounded = true;
            eng.drop.scaleY = 0.85;
            eng.drop.scaleX = 1.15;
          }
        }

        // Distance & Speed Progression
        eng.distance += eng.speed * dt * 0.1;
        const currentDistance = Math.floor(eng.distance);
        setScore(currentDistance);

        // Smooth acceleration up to ceiling (520 px/s)
        eng.speed = Math.min(520, 260 + currentDistance * 0.65);

        // Darkness ratio increases smoothly from distance 0 to 450
        eng.darknessRatio = Math.min(1, currentDistance / 420);

        // Obstacle generation with fair spacing
        eng.nextObstacleDistance -= eng.speed * dt;
        if (eng.nextObstacleDistance <= 0) {
          const families: Obstacle['family'][] = ['generic_logo', 'blurry_image', 'tangled_letters'];
          const chosenFamily = families[Math.floor(Math.random() * families.length)];

          let obsWidth = 44;
          let obsHeight = 44;
          if (chosenFamily === 'blurry_image') {
            obsWidth = 52;
            obsHeight = 40;
          } else if (chosenFamily === 'tangled_letters') {
            obsWidth = 46;
            obsHeight = 48;
          }

          eng.obstacles.push({
            id: Date.now() + Math.random(),
            family: chosenFamily,
            x: eng.width + 10,
            y: eng.groundY - obsHeight,
            width: obsWidth,
            height: obsHeight,
            cleared: false,
            correctionProgress: 0,
            variant: Math.floor(Math.random() * 3),
          });

          // Minimum fair spacing = jump flight distance * 1.35
          const jumpFlightDist = eng.speed * 0.58;
          const minSpacing = jumpFlightDist * 1.35 + obsWidth;
          eng.nextObstacleDistance = minSpacing + Math.random() * 220;
        }

        // Obstacles movement & collision
        for (let i = eng.obstacles.length - 1; i >= 0; i--) {
          const obs = eng.obstacles[i];
          obs.x -= eng.speed * dt;

          // Check if cleared
          if (!obs.cleared && eng.drop.x > obs.x + obs.width) {
            obs.cleared = true;
            gameAudio.playCorrect();

            // Spawn correction celebration particles
            const pColor = colorsRef.current.orChampagne;
            for (let p = 0; p < 8; p++) {
              eng.particles.push({
                x: obs.x + obs.width / 2,
                y: obs.y + obs.height / 2,
                vx: (Math.random() - 0.5) * 80,
                vy: -Math.random() * 90 - 40,
                radius: Math.random() * 2.5 + 1.5,
                color: p % 2 === 0 ? pColor : colorsRef.current.amethyste,
                alpha: 1,
                life: 0,
                maxLife: 0.45,
              });
            }
          }

          // Advance correction animation
          if (obs.cleared && obs.correctionProgress < 1) {
            obs.correctionProgress = Math.min(1, obs.correctionProgress + dt * 2.6);
          }

          // Collision detection (with 18% forgiving hitbox reduction)
          if (!obs.cleared) {
            const insetX = obs.width * 0.18;
            const insetY = obs.height * 0.18;
            const obsBox = {
              left: obs.x + insetX,
              right: obs.x + obs.width - insetX,
              top: obs.y + insetY,
              bottom: obs.y + obs.height,
            };

            const dropInsetX = eng.drop.width * 0.16;
            const dropInsetY = eng.drop.height * 0.14;
            const dropBox = {
              left: eng.drop.x + dropInsetX,
              right: eng.drop.x + eng.drop.width - dropInsetX,
              top: eng.drop.y + dropInsetY,
              bottom: eng.drop.y + eng.drop.height,
            };

            const isColliding =
              dropBox.right > obsBox.left &&
              dropBox.left < obsBox.right &&
              dropBox.bottom > obsBox.top &&
              dropBox.top < obsBox.bottom;

            if (isColliding) {
              triggerGameOver(currentDistance);
              break;
            }
          }

          // Remove offscreen obstacles
          if (obs.x + obs.width < -50) {
            eng.obstacles.splice(i, 1);
          }
        }
      }

      // Draw obstacles
      eng.obstacles.forEach((obs) => {
        drawObstacle(ctx, obs, colorsRef.current, isDarkTheme);
      });

      // ----------------------------------------------------
      // DRAW DROP (PERSONNAGE)
      // ----------------------------------------------------
      ctx.save();
      // Elastic squash & stretch recovery
      eng.drop.scaleX += (1 - eng.drop.scaleX) * dt * 10;
      eng.drop.scaleY += (1 - eng.drop.scaleY) * dt * 10;

      // Subtle running oscillation
      let yOffset = 0;
      if (eng.state === 'running' && eng.drop.isGrounded) {
        eng.drop.bobTime += dt * 14;
        yOffset = Math.sin(eng.drop.bobTime) * 1.5;
      }

      const dropX = eng.drop.x;
      const dropY = eng.drop.y + yOffset;
      const dropW = eng.drop.width;
      const dropH = eng.drop.height;

      ctx.translate(dropX + dropW / 2, dropY + dropH);
      ctx.scale(eng.drop.scaleX, eng.drop.scaleY);
      ctx.translate(-(dropX + dropW / 2), -(dropY + dropH));

      // Crossfade between purple and white drop based on background darkness
      const whiteRatio = Math.max(0, Math.min(1, (eng.darknessRatio - 0.35) / 0.3));

      if (whiteRatio < 1 && purpleDropImg.current && purpleDropImg.current.complete) {
        ctx.globalAlpha = 1 - whiteRatio;
        ctx.drawImage(purpleDropImg.current, dropX, dropY, dropW, dropH);
      }

      if (whiteRatio > 0 && whiteDropImg.current && whiteDropImg.current.complete) {
        ctx.globalAlpha = whiteRatio;
        ctx.drawImage(whiteDropImg.current, dropX, dropY, dropW, dropH);
      }
      ctx.restore();

      // ----------------------------------------------------
      // PARTICLES UPDATE & DRAW
      // ----------------------------------------------------
      ctx.save();
      for (let i = eng.particles.length - 1; i >= 0; i--) {
        const p = eng.particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          eng.particles.splice(i, 1);
          continue;
        }

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 400 * dt; // gravity
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ----------------------------------------------------
      // HUD / SCORE (TOP RIGHT OF CANVAS)
      // ----------------------------------------------------
      if (eng.state === 'running' || eng.state === 'ready') {
        ctx.save();
        const hudTextColor = isDarkTheme ? '#FFFFFF' : colorsRef.current.onyx;
        const hudSubColor = isDarkTheme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(13, 10, 24, 0.6)';

        ctx.textAlign = 'right';
        ctx.font = '600 13px "Jost", sans-serif';
        ctx.fillStyle = hudTextColor;
        ctx.fillText(`Score : ${Math.floor(eng.distance)}`, eng.width - 55, 28);

        if (highScore > 0) {
          ctx.font = '400 11px "Jost", sans-serif';
          ctx.fillStyle = hudSubColor;
          ctx.fillText(`Record : ${highScore}`, eng.width - 55, 46);
        }
        ctx.restore();
      }

      // ----------------------------------------------------
      // READY INSTRUCTION PROMPT OVERLAY
      // ----------------------------------------------------
      if (eng.state === 'ready') {
        ctx.save();
        const promptColor = isDarkTheme ? '#FFFFFF' : colorsRef.current.violetImperial;
        ctx.textAlign = 'center';
        ctx.font = '600 14px "Jost", sans-serif';
        ctx.fillStyle = promptColor;
        const promptText = isTouchDevice
          ? 'Touchez l’écran pour sauter et démarrer'
          : 'Appuyez sur Espace ou ↑ pour sauter';
        ctx.fillText(promptText, eng.width / 2, eng.groundY - 70);

        ctx.font = '400 12px "Jost", sans-serif';
        ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(13, 10, 24, 0.7)';
        ctx.fillText('Esquivez les obstacles pour les corriger avec l’identité Class S', eng.width / 2, eng.groundY - 50);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [highScore, isTouchDevice, prefersReducedMotion, triggerGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        // Prevent window scrolling only if game is focused/active
        const container = containerRef.current;
        const isHoveredOrFocused =
          container &&
          (container.contains(document.activeElement) ||
            container.matches(':hover') ||
            gameState === 'running');

        if (isHoveredOrFocused) {
          e.preventDefault();
        }

        if (gameState === 'intro') return;
        if (gameState === 'gameover') {
          // Replay on space
          restartGame();
          return;
        }

        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, restartGame]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-label="Jeu du runner Class S : faites sauter la goutte par-dessus les obstacles"
      className="relative w-full rounded-3xl overflow-hidden shadow-soft-lg border border-violet-imperial/20 select-none outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial transition-shadow"
      style={{ touchAction: 'none' }}
      onClick={() => {
        if (gameState === 'ready' || gameState === 'running') {
          jump();
        }
      }}
    >
      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite">
        {accessibilityAnnouncement}
      </div>

      {/* Main Game Canvas */}
      <canvas ref={canvasRef} className="block w-full h-auto cursor-pointer" />

      {/* Sound Toggle Button (Top-Right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSound();
        }}
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Désactiver les effets sonores' : 'Activer les effets sonores'}
        className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/20 text-onyx transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial"
      >
        {soundOn ? (
          <Volume2 className="w-4 h-4 text-violet-imperial" />
        ) : (
          <VolumeX className="w-4 h-4 text-onyx/60" />
        )}
      </button>

      {/* Game Over Screen Overlay */}
      {gameState === 'gameover' && (
        <div
          className="absolute inset-0 z-30 bg-onyx/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center font-body animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-md w-full space-y-5">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs uppercase tracking-wider text-or-champagne font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-or-champagne" />
              <span>Fin de partie</span>
            </div>

            {/* Score & Record Display */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-title font-bold text-white tracking-tight">
                Score : {score}
              </div>
              <div className="text-sm text-ivoire-violet/75">
                {isNewHigh ? (
                  <span className="text-or-champagne font-semibold">
                    🎉 Nouveau record personnel battu ! ({score})
                  </span>
                ) : (
                  <span>Meilleur record : {highScore}</span>
                )}
              </div>
            </div>

            {/* Explanatory Brand Note */}
            <p className="text-xs sm:text-sm text-ivoire-violet/70 leading-relaxed max-w-sm mx-auto">
              Chaque collision vous a montré ce que Class S ne fera jamais : des logos sans âme, des visuels flous ou une typographie bancale.
            </p>

            {/* ONLY TWO BUTTONS as strictly requested */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                ref={replayBtnRef}
                type="button"
                onClick={restartGame}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-violet-imperial hover:bg-violet-imperial/90 text-white text-sm font-semibold shadow-glow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejouer</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Home className="w-4 h-4" />
                <span>Revenir à l'accueil</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunnerGame;
