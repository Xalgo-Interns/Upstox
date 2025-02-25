const HistoricalDataService = require("../src/data/historical");

describe("HistoricalDataService", () => {
  test("getHistoricalCandleData should throw error on missing params", async () => {
    await expect(
      HistoricalDataService.getHistoricalCandleData("token")
    ).rejects.toThrow("Missing required parameters");
  });

  // Add more tests with mocked Axios responses
});
