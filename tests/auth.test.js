const AuthService = require("../src/auth/auth");

describe("AuthService", () => {
  test("getLoginUrl should return a valid URL", () => {
    const url = AuthService.getLoginUrl();
    expect(url).toContain(
      "https://api.upstox.com/v2/login/authorization/dialog"
    );
  });

  // Add more tests with mocked Axios responses
});
