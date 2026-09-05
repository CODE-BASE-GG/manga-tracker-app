import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeriesList } from "./SeriesList";

const props = {
  onBumpChapter: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("SeriesList", () => {
  it("shows loading, error, and empty states", () => {
    const { rerender } = render(
      <SeriesList {...props} series={[]} isLoading={true} error={null} />,
    );
    expect(screen.getByText("Loading...")).toBeVisible();

    rerender(
      <SeriesList {...props} series={[]} isLoading={false} error="Unable to load" />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load");

    rerender(
      <SeriesList {...props} series={[]} isLoading={false} error={null} />,
    );
    expect(screen.getByRole("heading", { name: "No series yet" })).toBeVisible();
  });
});
