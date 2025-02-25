const WebSocket = require("ws");
const config = require("../config");

class LiveDataService {
  static startMarketDataFeed(accessToken) {
    try {
      const ws = new WebSocket(config.wsMarketFeedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      ws.on("open", () => {
        console.log("Market data feed connected");
      });

      ws.on("message", (data) => {
        console.log("Market data received:", data.toString());
      });

      ws.on("error", (error) => {
        console.error("Market data feed error:", error.message);
      });

      ws.on("close", () => {
        console.log("Market data feed disconnected");
      });

      return ws;
    } catch (error) {
      console.error("Error starting market data feed:", error.message);
      throw new Error("Failed to start market data feed");
    }
  }

  static startPortfolioStreamFeed(accessToken) {
    try {
      const ws = new WebSocket(config.wsPortfolioFeedUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      ws.on("open", () => {
        console.log("Portfolio stream feed connected");
      });

      ws.on("message", (data) => {
        console.log("Portfolio data received:", data.toString());
      });

      ws.on("error", (error) => {
        console.error("Portfolio stream feed error:", error.message);
      });

      ws.on("close", () => {
        console.log("Portfolio stream feed disconnected");
      });

      return ws;
    } catch (error) {
      console.error("Error starting portfolio stream feed:", error.message);
      throw new Error("Failed to start portfolio stream feed");
    }
  }
}

module.exports = LiveDataService;
