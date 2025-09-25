 import { forgotPasswordApi } from "./fetchForgotPassword";
describe('forgotPasswordApi', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    if (consoleErrorSpy && typeof consoleErrorSpy.mockRestore === "function") {
      consoleErrorSpy.mockRestore();
    }
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return data when response is ok and JSON is valid", async () => {
    const mockData = { detail: "OTP sent" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockData)),
      } as Response)
    );

    const result = await forgotPasswordApi("semhal@gmail.com");

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith("/api/forgotPassword/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "semhal@gmail.com" }), 
    });
  });

  it("should throw error when response is not ok and JSON is valid", async () => {
    const mockError = { detail: "Invalid email" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve(JSON.stringify(mockError)),
      } as Response)
    );

    await expect(forgotPasswordApi("semhal@gmail.com")).rejects.toThrow(
      "Invalid email"
    );
  });

  it("should throw error when response JSON is invalid", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("invalid json"),
      } as Response)
    );

    await expect(forgotPasswordApi("semhal@gmail.com")).rejects.toThrow(
      "Invalid JSON response from server"
    );
  });

  it("should throw error when fetch rejects (network error)", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network Error")));

    await expect(forgotPasswordApi("semhal@gmail.com")).rejects.toThrow(
      "Network Error"
    );
  });
});
