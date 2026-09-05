import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SeriesCard } from "./SeriesCard";
import type { Series } from "../types";

const series: Series = {
  id: "series-1",
  title: "A Great Series",
  altTitle: "An Alternate Title",
  type: "MANGA",
  status: "PLAN_TO_READ",
  currentChapter: 4,
  totalChapter: 12,
  rating: null,
  notes: null,
  coverUrl: null,
  sourceUrl: null,
  createdAt: "2026-09-05T00:00:00.000Z",
  updatedAt: "2026-09-05T00:00:00.000Z",
};

describe("SeriesCard", () => {
  it("renders series details and delegates actions", async () => {
    const user = userEvent.setup();
    const onBumpChapter = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <SeriesCard
        series={series}
        onBumpChapter={onBumpChapter}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole("heading", { name: series.title })).toBeVisible();
    expect(screen.getByText("Chapter 4 / 12")).toBeVisible();
    expect(screen.getByText("PLANTOREAD")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "+1 Chapter" }));
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onBumpChapter).toHaveBeenCalledWith(series.id);
    expect(onEdit).toHaveBeenCalledWith(series);
    expect(onDelete).toHaveBeenCalledWith(series.id);
  });
});
