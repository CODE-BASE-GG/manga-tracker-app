import type { Series } from "../types";
import { SeriesCard } from "./SeriesCrad";

interface SeriesListProps {
  series: Series[];
  isLoading: boolean;
  error: string | null;
  onBumpChapter: (id: string) => void;
  onEdit: (series: Series) => void;
}

export function SeriesList({
  series,
  isLoading,
  error,
  onBumpChapter,
  onEdit,
}: SeriesListProps) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (series.length === 0) {
    return (
      <div className="empty-state">
        <h2>No series yet</h2>
        <p>Add a series to start tracking your reading.</p>
      </div>
    );
  }

  return (
    <section className="series-grid">
      {series.map((item) => (
        <SeriesCard
          key={item.id}
          series={item}
          onBumpChapter={onBumpChapter}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}
