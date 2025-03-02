const express = require("express");
const AuthService = require("./auth/auth");
const HistoricalDataService = require("./data/historical");
const LiveDataService = require("./data/live");
const OrderService = require("./orders/orders");
const config = require("./config");

const app = express();
let accessToken = null;
let marketWs = null;
let portfolioWs = null;

// Middleware to parse JSON bodies for POST and PUT requests
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Login route: Redirects to Upstox login page
app.get("/login", (req, res) => {
  try {
    const loginUrl = AuthService.getLoginUrl();
    res.redirect(loginUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Callback route: Handles Upstox redirect and fetches access token
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

// Historical data route: Fetches historical candle data
app.get("/historical", async (req, res) => {
  try {
    const { instrumentKey, interval, toDate, fromDate } = req.query;

    if (!instrumentKey || !interval || !toDate || !fromDate) {
      throw new Error(
        "Missing required query parameters: instrumentKey, interval, toDate, fromDate"
      );
    }

    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please authenticate via /login first."
      );
    }

    const data = await HistoricalDataService.getHistoricalCandleData(
      accessToken,
      instrumentKey,
      interval,
      toDate,
      fromDate
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Place order route: Places a new order
app.post("/orders/place", async (req, res) => {
  try {
    const orderDetails = req.body;

    if (
      !orderDetails ||
      !orderDetails.symbol ||
      !orderDetails.quantity ||
      !orderDetails.transaction_type
    ) {
      throw new Error(
        "Missing required order details: symbol, quantity, transaction_type"
      );
    }

    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please authenticate via /login first."
      );
    }

    const result = await OrderService.placeOrder(accessToken, orderDetails);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order route: Cancels an existing order
app.delete("/orders/cancel", async (req, res) => {
  try {
    const { orderId } = req.query;

    if (!orderId) {
      throw new Error("Missing required query parameter: orderId");
    }

    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please authenticate via /login first."
      );
    }

    const result = await OrderService.cancelOrder(accessToken, orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify order route: Modifies an existing order
app.put("/orders/modify", async (req, res) => {
  try {
    const { orderId } = req.query;
    const modifications = req.body;

    if (!orderId || !modifications) {
      throw new Error("Missing required parameters: orderId, modifications");
    }

    if (!accessToken) {
      throw new Error(
        "Not authenticated. Please authenticate via /login first."
      );
    }

    const result = await OrderService.modifyOrder(
      accessToken,
      orderId,
      modifications
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  if (marketWs) marketWs.close();
  if (portfolioWs) portfolioWs.close();
  process.exit(0);
});
