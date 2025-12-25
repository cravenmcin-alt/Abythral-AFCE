export enum MarketRegime {
  STABLE = 'STABLE',
  VOLATILE = 'VOLATILE',
  FRAGILE = 'FRAGILE',
  STRESSED = 'STRESSED'
}

export interface VisualMetric {
  label: string;
  value: number;
}

export interface CryptographicThought {
  id: string;
  hash: string;
  timestamp: number;
  modality: 'TEXT' | 'SERIES' | 'VISUAL' | 'AUDIO' | 'BEHAVIORAL';
  content: string;
  reasoning: string;
}

export interface MarketState {
  regime: MarketRegime;
  instabilityProbability: number;
  liquidityStress: number;
  narrativeDivergence: number;
  constraintVolume: number; 
  detectabilityGradient: number;
}

export interface HistoryNode {
  timestamp: number;
  instability: number;
  stress: number;
}

export interface CognitionReport {
  timestamp: number;
  summary: string;
  thoughts: CryptographicThought[];
  state: MarketState;
  activeAxioms: string[];
  visualMetrics: VisualMetric[];
}
