import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import * as AuthContext from "../context/AuthContext";

const renderWithUser = (user) => {
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
        user,
        saveLogin: vi.fn(),
        logout: vi.fn()
    });

    return render(
        <MemoryRouter initialEntries={["/dashboard"]}>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <p>Secret dashboard</p>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<p>Login page</p>} />
            </Routes>
        </MemoryRouter>
    );
};

describe("ProtectedRoute", () => {
    test("renders children when authenticated", () => {
        renderWithUser({ name: "Ada" });

        expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
    });

    test("redirects to login when anonymous", () => {
        renderWithUser(null);

        expect(screen.getByText("Login page")).toBeInTheDocument();
    });
});
