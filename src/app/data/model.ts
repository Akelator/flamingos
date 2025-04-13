export interface CUT {
  T: string;
  song?: string;
  tempo?: number;
  start?: string;
  end?: string;
  bpm?: {
    start: number;
    end: number;
  };
  change?: boolean;
  up?: boolean;
  dur?: number;
  perc?: number;
  duration?: string;
  black?: boolean;
}
