import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import Secure from "../pages/secure";

// Mock the NextAuth package
jest.mock("next-auth/react");

describe("Client-side testing of secure pages", () => {
  afterEach(() => {
    // Clear all mocks between tests
    jest.resetAllMocks();
  });

  test("Renders secure portions of page when logged in", async () => {
    // When rendering an individual page we can just mock useSession (in this case to
    // simulate an authenticated user)
    useSession.mockReturnValue({
      data: {
        user: { id: 1 },
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
      },
      status: "authenticated",
    });
    render(<Secure />);
    expect(useSession).toBeCalledWith({ required: true });
    expect(screen.getByText(/\{ "user": \{ "id": 1 \}/i)).toBeInTheDocument();
  });

  test("Doesn't render secure portions when not logged in", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<Secure />);
    expect(
      screen.queryByText(/\{ "user": \{ "id": 1 \}/i),
    ).not.toBeInTheDocument();
  });
});
