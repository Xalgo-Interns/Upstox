const axios = require("axios");
const config = require("../config");

class HistoricalDataService {
  static async getHistoricalCandleData(
    accessToken,
    instrumentKey,
    interval,
    toDate,
    fromDate
  ) {
    try {
      if (!instrumentKey || !interval || !toDate || !fromDate) {
        throw new Error("Missing required parameters");
      }

      const response = await axios.get(
        `${config.baseUrl}/historical-candle/${instrumentKey}/${interval}/${toDate}/${fromDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching historical data:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch historical data");
    }
  }
}

module.exports = HistoricalDataService;
