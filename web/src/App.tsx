import { useState } from "react";
import { bumpChapter } from "./api/seriesApi";
import { SeriesList } from "./components/SeriesList";
import { StatusFilter } from "./components/StatusFilter";
import { useSeries } from "./hooks/useSeries";
import type { Series, SeriesStatus } from "./types";

function App() {
  const [status, setStatus] = useState<SeriesStatus | undefined>();
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  const { series, isLoading, error, refetch } = useSeries(status);

  const handleBumpChapter = async (id: string) => {
    try {
      await bumpChapter(id);
      await refetch();
    } catch (err) {
      console.error("Failed to bump chapter:", err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Reading Tracker</h1>
          <p>Track what you're reading.</p>
        </div>

        <button type="button">Add Series</button>
      </header>

      <StatusFilter value={status} onChange={setStatus} />

      <main>
        <SeriesList
          series={series}
          isLoading={isLoading}
          error={error}
          onBumpChapter={handleBumpChapter}
          onEdit={setEditingSeries}
        />
      </main>

      {editingSeries && <p>Editing: {editingSeries.title}</p>}
    </div>
  );
}

export default App;
