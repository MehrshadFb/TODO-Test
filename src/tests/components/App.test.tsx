import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import App from "../../App";
import * as API from "../../API";
import userEvent from "@testing-library/user-event";

const mockData = [{ title: "task1" }, { title: "task2" }, { title: "task3" }];
const mockNullData = null;

describe("App", () => {
  it('should render "To-Do List" heading', () => {
    render(<App />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/to-do list/i);
  });

  it('should render "Loading..." while fetching data', () => {
    render(<App />);
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();
  });

  it("Should fetch API", async () => {
    const getAPI = vi.spyOn(API, "fetchData");
    render(<App />);
    expect(getAPI).toHaveBeenCalledOnce();
  });

  it("should render tasks if data is avaiable on API", async () => {
    const fetchSpy = vi.spyOn(API, "fetchData").mockResolvedValue(mockData);
    render(<App />);
    expect(fetchSpy).toHaveBeenCalledOnce();
    mockData.forEach(async (data) => {
      const task = await screen.findByRole(data.title);
      expect(task).toBeInTheDocument();
    });
  });

  it("should render error message if data is not avaiable on API", async () => {
    const fetchSpy = vi.spyOn(API, "fetchData").mockResolvedValue(mockNullData);
    render(<App />);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const error = await screen.findByText(/wrong/i);
    expect(error).toBeInTheDocument();
  });

  it("should render tasks and let users delete tasks", async () => {
    const fetchSpy = vi.spyOn(API, "fetchData").mockResolvedValue(mockData);
    render(<App />);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const btn = await screen.findAllByRole("button", { name: "Delete" });
    expect(btn).lengthOf(mockData.length);
    fireEvent.click(btn[0]);
    expect(screen.queryByText("task1")).not.toBeInTheDocument();
  });

  it("should render tasks and let users add a new task", async () => {
    const fetchSpy = vi.spyOn(API, "fetchData").mockResolvedValue(mockData);
    render(<App />);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const button = await screen.findByRole("button", { name: "Add" });
    const input = screen.getByPlaceholderText(/task/i);
    const user = userEvent.setup();
    await user.type(input, "task4");
    await user.click(button);
    expect(screen.queryByText("task4")).toBeInTheDocument();
  });

  it("should render tasks and let users edit tasks", async () => {
    const fetchSpy = vi.spyOn(API, "fetchData").mockResolvedValue(mockData);
    render(<App />);
    expect(fetchSpy).toHaveBeenCalledOnce();
    const button = await screen.findByRole("button", { name: "Edit" });
    const user = userEvent.setup();
    await user.click(button);
    const input = await screen.findAllByPlaceholderText(/edit/i);
    await user.clear(input[0]);
    await user.type(input[0], "edited task1");
    await user.click(button);
  });

  // it('should render error if users set empty string for edit tasks', async () => {
  //     const fetchSpy = vi.spyOn(API, 'fetchData').mockResolvedValue(mockData);
  //     render(<App/>)
  //     expect(fetchSpy).toHaveBeenCalledOnce()
  //     const button = await screen.findByRole("button", {name:"Edit"})
  //     const user = userEvent.setup()
  //     await user.click(button)
  //     const input = await screen.findAllByPlaceholderText(/edit/i);
  //     await user.clear(input[0])
  //     // const alert = await screen.
  //     // expect(alert).toBeInTheDocument()
  //     screen.debug()

  //     // const alertMock = vi.spyOn(window, 'alert').mockImplementation();
  // })
});
