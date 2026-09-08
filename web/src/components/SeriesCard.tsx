import type { Series } from "../types";

interface SeriesCardProps {
  series: Series;
  onBumpChapter: (id: string) => void;
  onEdit: (series: Series) => void;
  onDelete: (id: string) => void;
}

export function SeriesCard({ 
  series, 
  onBumpChapter, 
  onEdit,
  onDelete,  
}: SeriesCardProps) {
  return (
    <article className="series-card" style={{backgroundImage: `url(${series.coverUrl})`}}>
      <div className="series-card__content">
        <div className="series-card__header">

          <h2>{series.title}</h2>

          <div className="series-card__badges">
            <span className="badge badge--type">{series.type}</span>

            <span className="badge badge--status">
              {series.status.replaceAll("_", "")}
            </span>
          </div>
        </div>

        {series.altTitle && (
          <p className="series-card__alt-title">{series.altTitle}</p>
        )}

        <p className="series-card__chapters">
          Chapter {series.currentChapter}
          {series.totalChapter !== null && ` / ${series.totalChapter}`}
        </p>

        <div className="series-card__actions">
          <button type="button" onClick={() => onBumpChapter(series.id)}>
            +1 Chapter
          </button>

          <button type="button" onClick={() => onEdit(series)}>
            Edit
          </button>

          <button type="button" onClick={() => onDelete(series.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
/*
 *
          <div className="series-card__cover">
            <img src={series.coverUrl || ""} alt={`${series.title} banner`} />
          </div>
 *
 * */
