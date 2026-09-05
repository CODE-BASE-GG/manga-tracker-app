import { useState } from "react";
import { createSeries } from "../api/seriesApi";
import type { CreateSeriesDto, SeriesStatus, SeriesType } from "../types";

interface SeriesFormProps {
  onCreated: () => Promise<void>;
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

export function SeriesForm({ onCreated, onClose }: SeriesFormProps) {
  const [title, setTitle] = useState("");
  const [altTitle, setAltTitle] = useState("");
  const [type, setType] = useState<SeriesType>("MANGA");
  const [status, setStatus] = useState<SeriesStatus>("PLAN_TO_READ");
  const [currentChapter, setCurrentChapter] = useState("");
  const [totalChapter, setTotalChapter] = useState("");
  const [rating, setRating] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    const dto: CreateSeriesDto = {
      title: trimmedTitle,
      type,
      status,
    };

    if (altTitle.trim()) {
      dto.altTitle = altTitle.trim();
    }

    if (currentChapter !== "") {
      const value = Number(currentChapter);

      if (!Number.isInteger(value) || value < 0) {
        setError("Current chapter must be a non-negative integer.");
        return;
      }

      dto.currentChapter = value;
    }

    if (totalChapter !== "") {
      const value = Number(totalChapter);

      if (!Number.isInteger(value) || value < 0) {
        setError("Total chapters must be a non-negative integer.");
        return;
      }

      dto.totalChapter = value;
    }

    if (rating !== "") {
      const value = Number(rating);

      if (!Number.isInteger(value) || value < 0) {
        setError("Rating must be a non-negative integer.");
        return;
      }

      dto.rating = value;
    }

    if (coverUrl.trim()) {
      dto.coverUrl = coverUrl.trim();
    }

    if (sourceUrl.trim()) {
      dto.sourceUrl = sourceUrl.trim();
    }

    if (notes.trim()) {
      dto.notes = notes.trim();
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await createSeries(dto);
      await onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create series.");
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
          <h2 id="series-form-title">Add Series</h2>

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
              {isSubmitting ? "Adding..." : "Add Series"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
