export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'needs_revision' | 'withdrawn';
export type Coordinates = [longitude: number, latitude: number];
export type SnapshotRecord = [name: string, summary: string];
export type AtlasEvent = [year: number, placeId: string, title: string];

export interface AtlasPlace {
  id: string;
  modern: string;
  region: string;
  source: string;
  locator: string;
  extra?: string;
  aliases?: Record<number, string[]>;
  status: ReviewStatus;
  records: Record<number, SnapshotRecord>;
}

export interface AtlasData {
  years: number[];
  periods: string[];
  places: AtlasPlace[];
  points: Record<string, Coordinates>;
  events: AtlasEvent[];
}

export type PlaceInput = Omit<AtlasPlace,'status'> & {status?: ReviewStatus};
export interface PeriodNote {
  era: string;
  title: string;
  summary: string;
  status?: ReviewStatus;
  citations?: {url:string;locator:string}[];
}
