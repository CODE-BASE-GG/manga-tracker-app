import { useState } from "react";
import { createSeries, updateSeries } from "../api/seriesApi";
import type {
  CreateSeriesDto,
  Series,
  SeriesStatus,
  SeriesType,
  UpdateSeriesDto,
} from "../types";

interface SeriesFormProps {
  series?: Series;
  onSaved: () => Promise<void>;
  onClose: () => void;
}

const seriesTypes: SeriesType[] = ["MANGA", "MANHWA", "MANHUA"];

const seriesStatuses: Array<{
  value: SeriesStatus;
  label: string;
}> = [
  { value: "READING", label: "Reading" },
  { value: "PLAN_TO_READ", label: "Plan to Read" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "DROPPED", label: "Dropped" },
  { value: "COMPLETED", label: "Completed" },
];

export function SeriesForm({ series, onSaved, onClose }: SeriesFormProps) {
  const isEditing = Boolean(series);

  const [title, setTitle] = useState(series?.title ?? "");
  const [altTitle, setAltTitle] = useState(series?.altTitle ?? "");
  const [type, setType] = useState<SeriesType>(series?.type ?? "MANGA");
  const [status, setStatus] = useState<SeriesStatus>(
    series?.status ?? "PLAN_TO_READ",
  );
  const [currentChapter, setCurrentChapter] = useState(
    series?.currentChapter.toString() ?? "",
  );
  const [totalChapter, setTotalChapter] = useState(
    series?.totalChapter?.toString() ?? "",
  );
  const [rating, setRating] = useState(series?.rating?.toString() ?? "");
  const [coverUrl, setCoverUrl] = useState(series?.coverUrl ?? "");
  const [sourceUrl, setSourceUrl] = useState(series?.sourceUrl ?? "");
  const [notes, setNotes] = useState(series?.notes ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    const parsedCurrentChapter =
      currentChapter === "" ? undefined : Number(currentChapter);

    const parsedTotalChapter =
      totalChapter === "" ? undefined : Number(totalChapter);

    const parsedRating = rating === "" ? undefined : Number(rating);

    if (
      parsedCurrentChapter !== undefined &&
      (!Number.isInteger(parsedCurrentChapter) || parsedCurrentChapter < 0)
    ) {
      setError("Current chapter must be a non-negative integer.");
      return;
    }

    if (
      parsedTotalChapter !== undefined &&
      (!Number.isInteger(parsedTotalChapter) || parsedTotalChapter < 0)
    ) {
      setError("Total chapters must be a non-negative integer.");
      return;
    }

    if (
      parsedRating !== undefined &&
      (!Number.isInteger(parsedRating) || parsedRating < 0)
    ) {
      setError("Rating must be a non-negative integer.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (isEditing && series) {
        const dto: UpdateSeriesDto = {
          title: trimmedTitle,
          altTitle: altTitle.trim(),
          type,
          status,
          currentChapter: parsedCurrentChapter,
          totalChapter: parsedTotalChapter,
          rating: parsedRating,
          notes: notes.trim(),
          coverUrl: coverUrl.trim(),
          sourceUrl: sourceUrl.trim(),
        };

        await updateSeries(series.id, dto);
      } else {
        const dto: CreateSeriesDto = {
          title: trimmedTitle,
          altTitle: altTitle.trim(),
          type,
          status,
          currentChapter: parsedCurrentChapter,
          totalChapter: parsedTotalChapter,
          rating: parsedRating,
          notes: notes.trim(),
          coverUrl: coverUrl.trim(),
          sourceUrl: sourceUrl.trim(),
        };

        await createSeries(dto);
      }

      await onSaved();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update series."
            : "Failed to create series.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="series-form-title"
      >
        <div className="modal__header">
          <h2 id="series-form-title">
            {isEditing ? "Edit Series" : "Add Series"}
          </h2>

          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Title *
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
              />
            </label>

            <label>
              Alternative Title
              <input
                value={altTitle}
                onChange={(event) => setAltTitle(event.target.value)}
              />
            </label>

            <label>
              Type
              <select
                value={type}
                onChange={(event) => setType(event.target.value as SeriesType)}
              >
                {seriesTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as SeriesStatus)
                }
              >
                {seriesStatuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Current Chapter
              <input
                type="number"
                min="0"
                step="1"
                value={currentChapter}
                onChange={(event) => setCurrentChapter(event.target.value)}
              />
            </label>

            <label>
              Total Chapters
              <input
                type="number"
                min="0"
                step="1"
                value={totalChapter}
                onChange={(event) => setTotalChapter(event.target.value)}
              />
            </label>

            <label>
              Rating
              <input
                type="number"
                min="0"
                step="1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
              />
            </label>

            <label>
              Cover URL
              <input
                type="url"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
              />
            </label>

            <label>
              Source URL
              <input
                type="url"
                value={sourceUrl}
                onChange={(event) => setSourceUrl(event.target.value)}
              />
            </label>

            <label className="form-field--full">
              Notes
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </label>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? "Saving..."
                  : "Adding..."
                : isEditing
                  ? "Save Changes"
                  : "Add Series"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
