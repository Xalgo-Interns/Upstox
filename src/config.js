require("dotenv").config();

const config = {
  apiKey: process.env.UPSTOX_API_KEY,
  apiSecret: process.env.UPSTOX_API_SECRET,
  redirectUri: process.env.UPSTOX_REDIRECT_URI,
  baseUrl: "https://api.upstox.com/v2",
  wsMarketFeedUrl: "wss://api.upstox.com/v2/feed/market-data-feed",
  wsPortfolioFeedUrl: "wss://api.upstox.com/v2/feed/portfolio-stream-feed",
  port: process.env.PORT || 3000,
};

if (!config.apiKey || !config.apiSecret || !config.redirectUri) {
  throw new Error("Missing required environment variables!");
}

module.exports = config;
