export type SeriesStatus = 
    | 'READING'
    | 'PLAN_TO_READ'
    | 'ON_HOLD'
    | 'DROPPED'
    | 'COMPLETED';

export type SeriesType =
    | 'MANGA'
    | 'MANHWA'
    | 'MANHUA'
    | 'NOVEL'
    | 'OTHER';

export interface Series {
  id: string;
  title: string;
  altTitle: string | null;
  type: SeriesType;
  status: SeriesStatus;
  currentChapter: number;
  totalChapters: number | null;
  coverUrl: string | null;
  sourceUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeriesDto {
  title: string;
  altTitle?: string;
  type?: SeriesType;
  status?: SeriesStatus;
  totalChapters?: number;
  coverUrl?: string;
  sourceUrl?: string;
  notes?: string;
}

export interface UpdateSeriesDto {
  title?: string;
  altTitle?: string;
  type?: SeriesType;
  status?: SeriesStatus;
  currentChapter?: number;
  totalChapters?: number;
  coverUrl?: string;
  sourceUrl?: string;
  notes?: string;
}