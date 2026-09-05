import { useState } from "react";
import { bumpChapter, deleteSeries } from "./api/seriesApi";
import { SeriesForm } from "./components/SeriesForm";
import { SeriesList } from "./components/SeriesList";
import { StatusFilter } from "./components/StatusFilter";
import { useSeries } from "./hooks/useSeries";
import type { Series, SeriesStatus } from "./types";
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal";

function App() {
  const [status, setStatus] = useState<SeriesStatus | undefined>();
  const [isAddingSeries, setIsAddingSeries] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [deletingSeries, setDeletingSeries] = useState<Series | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { series, isLoading, error, refetch } = useSeries(status);

  const handleBumpChapter = async (id: string) => {
    try {
      await bumpChapter(id);
      await refetch();
    } catch (err) {
      console.error("Failed to bump chapter:", err);
    }
  };

  const handleDeleteRequest = (id: string) => {
    const seriesToDelete = series.find(
      (item) => item.id === id,
    )

    if (!seriesToDelete) {
      return;
    }

    setDeleteError(null);
    setDeletingSeries(seriesToDelete);
  }

  const handleDeleteConfirm = async () => {
    if (!deletingSeries) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteSeries(deletingSeries.id);
      await refetch();

      setDeletingSeries(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Failed to delele series',
      )
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Reading Tracker</h1>
          <p>Track what you're reading.</p>
        </div>

        <button 
          type="button"
          onClick={() => setIsAddingSeries(true)}
        >
          Add Series
        </button>
      </header>

      <StatusFilter value={status} onChange={setStatus} />

      <main>
        <SeriesList
          series={series}
          isLoading={isLoading}
          error={error}
          onBumpChapter={handleBumpChapter}
          onEdit={setEditingSeries}
          onDelete={handleDeleteRequest}
        />
      </main>

      {isAddingSeries && (
        <SeriesForm
          onSaved={refetch}
          onClose={() => setIsAddingSeries(false)}
        />
      )}

      {editingSeries && (
        <SeriesForm
          series={editingSeries}
          onSaved={refetch}
          onClose={() => setEditingSeries(null)}
        />
      )}

      {deletingSeries && (
        <DeleteConfirmationModal
          title={deletingSeries.title}
          isDeleting={isDeleting}
          error={deleteError}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            if (!isDeleting) {
              setDeletingSeries(null)
              setDeleteError(null);
            }
          }}
        />
      )}
    </div>
  );
}

export default App;
