import "@testing-library/jest-dom/vitest";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import render from "../../tests/render";
import Button from "./Button";

describe("Button", () => {
  it("should render the button with its children", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });
});
