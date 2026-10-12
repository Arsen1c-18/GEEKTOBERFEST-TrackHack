import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";

describe("SearchBar", () => {
    test("calls onSearch with trimmed text", async () => {
        const user = userEvent.setup();
        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        await user.type(screen.getByPlaceholderText(/search by title/i), "  geek  ");
        await user.click(screen.getByRole("button", { name: /search/i }));

        expect(onSearch).toHaveBeenCalledWith("geek");
    });
});

describe("FilterBar", () => {
    test("emits status and mode changes", async () => {
        const user = userEvent.setup();
        const onStatusChange = vi.fn();
        const onModeChange = vi.fn();

        render(
            <FilterBar
                status=""
                mode=""
                onStatusChange={onStatusChange}
                onModeChange={onModeChange}
            />
        );

        const selects = screen.getAllByRole("combobox");
        await user.selectOptions(selects[0], "Completed");
        await user.selectOptions(selects[1], "Offline");

        expect(onStatusChange).toHaveBeenCalledWith("Completed");
        expect(onModeChange).toHaveBeenCalledWith("Offline");
    });
});
