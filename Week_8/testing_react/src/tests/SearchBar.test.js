import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { SearchBar } from "../components/SearchBar";


//Rendering
it("renders correctly", () => {
  const { queryByPlaceholderText } = render(<SearchBar />);
  expect(queryByPlaceholderText("Search")).toBeTruthy();
});

//input
describe("Input Value", () => {
  it("updates on change", () => {
    const { queryByPlaceholderText } = render(<SearchBar />);
    const searchInput = queryByPlaceholderText("Search");

    fireEvent.change(searchInput, { target: { value: "abc" } });
    expect(searchInput.value).toBe("abc");
  });
});

//search button
describe("Search Button", () => {
  describe("with empty query", () => {
    it("does not trigger requestSearch", () => {
      const requestSearch = jest.fn(); // Mock function
      const { queryByTestId, queryByPlaceholderText } = render(
        <SearchBar requestSearch={requestSearch} />
      );
      const buttonInput = queryByTestId("search-button");

      fireEvent.click(buttonInput);
      expect(requestSearch).not.toHaveBeenCalled();
    });
  });
  describe("with non empty query", () => {
    it("triggers requestSearch", () => {
      const requestSearch = jest.fn(); // Mock function
      const { queryByTestId, queryByPlaceholderText } = render(
        <SearchBar requestSearch={requestSearch} />
      );
      const searchInput = queryByPlaceholderText("Search");
      const buttonInput = queryByTestId("search-button");

      fireEvent.change(searchInput, { target: { value: "abc" } });
      expect(searchInput.value).toBe("abc");
      fireEvent.click(buttonInput);
      expect(requestSearch).toHaveBeenCalled();
      expect(searchInput.value).toBe("");
    });
  });
});
