const express = require("express");
const AuthService = require("./auth/auth");
const LiveDataService = require("./data/live");
const config = require("./config");

const app = express();
let accessToken = null;
let marketWs = null;
let portfolioWs = null;

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});


app.get("/login", (req, res) => {
  try {
    const loginUrl = AuthService.getLoginUrl();
    res.redirect(loginUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    if (!code) {
      throw new Error("No authorization code provided");
    }

    accessToken = await AuthService.getAccessToken(code);
    console.log("Access token obtained:", accessToken);

    // Start WebSocket feeds
    marketWs = LiveDataService.startMarketDataFeed(accessToken);
    portfolioWs = LiveDataService.startPortfolioStreamFeed(accessToken);

    res.json({ message: "Authentication successful, WebSocket feeds started" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  if (marketWs) marketWs.close();
  if (portfolioWs) portfolioWs.close();
  process.exit(0);
});
