export type GameState = 'intro' | 'ready' | 'running' | 'gameover';

export type ObstacleFamily = 'generic_logo' | 'blurry_image' | 'tangled_letters';

export interface Obstacle {
  id: number;
  family: ObstacleFamily;
  x: number;
  y: number;
  width: number;
  height: number;
  cleared: boolean;
  correctionProgress: number; // 0 (uncorrected) to 1 (fully corrected)
  variant: number; // visual variation within the family
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface FallingDigit {
  char: string;
  x: number;
  y: number;
  targetY: number;
  vy: number;
  delay: number; // time in ms before fall starts
  bounces: number;
  settled: boolean;
}

export interface ThemeColors {
  violetImperial: string;
  orChampagne: string;
  amethyste: string;
  ivoireViolet: string;
  ardoise: string;
  onyx: string;
}
