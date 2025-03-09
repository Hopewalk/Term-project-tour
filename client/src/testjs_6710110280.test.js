import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaginationComponent from "../src/Component/Pagination/PaginationComponent";

jest.mock("antd", () => ({
  Pagination: jest.fn(({ current, pageSize, total, onChange, showTotal }) => (
    <div data-testid="mock-pagination">
      {/* Render page numbers */}
      <div className="page-numbers">
        {Array.from(
          { length: Math.ceil(total / pageSize) },
          (_, i) => i + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            data-testid={`page-${pageNumber}`}
            className={current === pageNumber ? "active-page" : ""}
            onClick={() => onChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Jump to page input */}
      <div className="quick-jumper">
        <input
          data-testid="quick-jumper-input"
          type="number"
          min={1}
          max={Math.ceil(total / pageSize)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= Math.ceil(total / pageSize)) {
                onChange(page);
              }
            }
          }}
        />
      </div>

      {/* Show total info if enabled */}
      {showTotal && (
        <div data-testid="total-info">
          {showTotal(total, [
            (current - 1) * pageSize + 1,
            Math.min(current * pageSize, total),
          ])}
        </div>
      )}
    </div>
  )),
}));

describe("PaginationComponent", () => {
  const defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 100,
    onChange: jest.fn(),
    showTotal: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not show total information when showTotal is false", () => {
    const props = { ...defaultProps, showTotal: false };
    render(<PaginationComponent {...props} />);

    expect(screen.queryByTestId("total-info")).not.toBeInTheDocument();
  });

  test("displays correct flex and margin styles", () => {
    const { container } = render(<PaginationComponent {...defaultProps} />);

    // Check that the container div has the expected classes
    const paginationContainer = container.firstChild;
    expect(paginationContainer).toHaveClass("flex");
    expect(paginationContainer).toHaveClass("justify-center");
    expect(paginationContainer).toHaveClass("mt-6");
  });
});
