import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusFilter } from "./StatusFilter";

describe("StatusFilter", () => {
  it("reports the selected status and can clear it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<StatusFilter value="READING" onChange={onChange} />);

    expect(screen.getByRole("button", { name: "Reading" })).toHaveClass("active");

    await user.click(screen.getByRole("button", { name: "Completed" }));
    await user.click(screen.getByRole("button", { name: "All" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "COMPLETED");
    expect(onChange).toHaveBeenNthCalledWith(2, undefined);
  });
});
