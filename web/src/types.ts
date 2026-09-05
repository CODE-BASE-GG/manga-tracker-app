export type SeriesType = "MANGA" | "MANHWA" | "MANHUA";

export type SeriesStatus =
  "READING" | "PLAN_TO_READ" | "ON_HOLD" | "DROPPED" | "COMPLETED";

export interface Series {
  id: string;
  title: string;
  altTitle: string | null;
  type: SeriesType;
  status: SeriesStatus;
  currentChapter: number;
  totalChapter: number | null;
  rating: number | null;
  notes: string | null;
  coverUrl: string | null;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSeriesDto {
  title: string;
  altTitle?: string;
  type: SeriesType;
  status?: SeriesStatus;
  currentChapter?: number;
  totalChapter?: number;
  rating?: number;
  notes?: string;
  coverUrl?: string;
  sourceUrl?: string;
}

export interface UpdateSeriesDto {
  title?: string;
  altTitle?: string;
  type?: SeriesType;
  status?: SeriesStatus;
  currentChapter?: number;
  totalChapter?: number;
  rating?: number;
  notes?: string;
  coverUrl?: string;
  sourceUrl?: string;
}
