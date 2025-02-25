
---

# Upstox Broker Integration

A Node.js application integrating with the Upstox API to provide authentication, historical market data, real-time market and portfolio feeds via WebSockets, and order management functionalities. This project is designed for developers looking to build trading tools or automate strategies using Upstox's Open API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Extending the Application](#extending-the-application)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Features

- **Authentication**: Implements OAuth 2.0 flow for secure access to the Upstox API.
- **Historical Data**: Fetches historical candle data for specified instruments and time intervals.
- **Real-Time Data**: Provides live market data and portfolio updates via WebSocket feeds.
- **Order Management**: Supports placing, canceling, and modifying orders.
- **Error Handling**: Robust error handling with `try-catch` blocks and detailed logging.
- **Modular Design**: Organized codebase with separate modules for authentication, data, and orders.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Version 14.x or higher (download from [nodejs.org](https://nodejs.org/)).
- **npm**: Comes bundled with Node.js.
- **Upstox API Credentials**: Obtain an API key and secret from the [Upstox Developer Console](https://upstox.com/developer/). You’ll need to create an app to get these credentials.
- **Text Editor**: Any editor like VS Code, Sublime Text, or similar.
- **Basic Knowledge**: Familiarity with JavaScript, Node.js, and REST/WebSocket APIs.

## Installation

Follow these steps to set up the project locally:

1. **Clone or Download the Repository**:
   If using Git:

   ```bash
   git clone <repository-url>
   cd broker-integration
   ```

   Alternatively, download the ZIP file and extract it.

2. **Install Dependencies**:
   Navigate to the project directory and run:

   ```bash
   npm install
   ```

   This installs required packages: `express`, `axios`, `ws`, `dotenv`, `qs`, and `jest`.

3. **Verify Installation**:
   Check that `node_modules/` and `package-lock.json` are created in the root directory.

## Configuration

Configure the application with your Upstox API credentials:

1. **Create a `.env` File**:
   In the root directory, create a file named `.env` and add the following:

   ```plaintext
   UPSTOX_API_KEY=your_api_key_here
   UPSTOX_API_SECRET=your_api_secret_here
   UPSTOX_REDIRECT_URI=http://localhost:3000/callback
   PORT=3000
   ```

   - Replace `your_api_key_here` and `your_api_secret_here` with your Upstox API credentials.
   - Ensure `UPSTOX_REDIRECT_URI` matches the redirect URI registered in the Upstox Developer Console.
   - `PORT` can be changed if needed (default is 3000).

2. **Secure Your Credentials**:
   Do not commit the `.env` file to version control. The `.gitignore` file already excludes it.

3. **Review `.env.example`**:
   The provided `.env.example` file serves as a template for reference.

## Running the Application

Start the server and authenticate with Upstox:

1. **Launch the Server**:
   Run the following command in the terminal:

   ```bash
   npm start
   ```

   You should see:

   ```
   Server running on port 3000
   ```

2. **Authenticate with Upstox**:
   - Open your browser and navigate to: `http://localhost:3000/login`.
   - You’ll be redirected to the Upstox login page.
   - Log in with your Upstox credentials and authorize the app.
   - Upon successful authorization, you’ll be redirected to `http://localhost:3000/callback`, and the server will:
     - Fetch an access token.
     - Start WebSocket feeds for market data and portfolio updates.
   - Check the terminal for logs like:

     ```
     Access token obtained: <token>
     Market data feed connected
     Portfolio stream feed connected
     ```

3. **Verify Operation**:
   - Look for WebSocket messages in the terminal (e.g., `Market data received: ...`).
   - The server remains running until stopped manually.

4. **Stop the Server**:
   Press `Ctrl + C` in the terminal to shut down gracefully. WebSocket connections will close automatically.

## Usage

Here’s how to interact with the application’s core functionalities:

### Authentication

- **Route**: `GET /login`
  - Redirects to Upstox’s authorization page.
- **Route**: `GET /callback`
  - Handles the redirect from Upstox, retrieves the access token, and starts WebSocket feeds.
- **Example**: Visit `http://localhost:3000/login` to begin.

### Historical Data

- **Function**: `HistoricalDataService.getHistoricalCandleData(accessToken, instrumentKey, interval, toDate, fromDate)`
  - Fetches historical candle data.
  - Example usage in code:

    ```javascript
    const HistoricalDataService = require('./src/data/historical');
    const data = await HistoricalDataService.getHistoricalCandleData(
      accessToken,
      'NSE_EQ|INE002A01018', // Reliance Industries
      '1minute',
      '2025-02-25',
      '2025-02-24'
    );
    console.log(data);
    ```

### Real-Time Data

- **WebSocket Feeds**: Started automatically after authentication.
  - Market data: Logs real-time market updates.
  - Portfolio stream: Logs portfolio changes (e.g., orders, positions).
  - Extend the `LiveDataService` event handlers in `src/data/live.js` to process data as needed.

### Order Management

- **Functions** in `OrderService`:
  - `placeOrder(accessToken, orderDetails)`: Places a new order.

    ```javascript
    const OrderService = require('./src/orders/orders');
    const order = await OrderService.placeOrder(accessToken, {
      quantity: 1,
      product: 'D',
      validity: 'DAY',
      price: 1500,
      symbol: 'NSE_EQ|INE002A01018',
      order_type: 'LIMIT',
      transaction_type: 'BUY'
    });
    console.log(order);
    ```

  - `cancelOrder(accessToken, orderId)`: Cancels an existing order.

    ```javascript
    const result = await OrderService.cancelOrder(accessToken, 'order_id_here');
    ```

  - `modifyOrder(accessToken, orderId, modifications)`: Modifies an order.

    ```javascript
    const result = await OrderService.modifyOrder(accessToken, 'order_id_here', {
      price: 1550,
      quantity: 2
    });
    ```

- **Note**: Add routes in `index.js` to expose these as REST APIs if needed (e.g., `POST /orders`).

## Project Structure

```
broker-integration/
├── src/
│   ├── auth/
│   │   └── auth.js          # Authentication logic
│   ├── data/
│   │   ├── historical.js    # Historical data fetching
│   │   └── live.js          # Real-time WebSocket feeds
│   ├── orders/
│   │   └── orders.js        # Order placement, cancellation, modification
│   ├── config.js            # Configuration and environment variables
│   └── index.js             # Main server entry point
├── tests/
│   ├── auth.test.js         # Authentication tests
│   ├── data.test.js         # Data fetching tests
│   ├── orders.test.js       # Order management tests
├── .gitignore               # Excludes node_modules, .env
├── .env.example             # Template for environment variables
├── package.json             # Project dependencies and scripts
└── README.md                # This file
```

## Testing

Run unit tests to verify functionality:

1. **Run Tests**:

   ```bash
   npm test
   ```

   This uses Jest to execute tests in the `tests/` directory.

2. **Current Tests**:
   - Basic validation (e.g., missing parameters).
   - Expand by mocking Axios and WebSocket responses:

     ```javascript
     jest.mock('axios');
     axios.get.mockResolvedValue({ data: { success: true } });
     ```

3. **Add More Tests**:
   - Simulate API responses for historical data.
   - Test WebSocket connections with mock servers.

## Extending the Application

Enhance the project with these suggestions:

1. **REST API Endpoints**:
   Add routes in `index.js` for historical data and orders:

   ```javascript
   app.get('/historical', async (req, res) => {
     const { instrumentKey, interval, toDate, fromDate } = req.query;
     const data = await HistoricalDataService.getHistoricalCandleData(accessToken, instrumentKey, interval, toDate, fromDate);
     res.json(data);
   });
   ```

2. **WebSocket Subscriptions**:
   Modify `live.js` to subscribe to specific instruments:

   ```javascript
   ws.on('open', () => {
     ws.send(JSON.stringify({ instrumentKeys: ['NSE_EQ|INE002A01018'] }));
   });
   ```

   Refer to Upstox API docs for exact payload format.

3. **Persistent Storage**:
   Store `accessToken` in a database (e.g., Redis) instead of memory:

   ```javascript
   const redis = require('redis');
   const client = redis.createClient();
   await client.set('access_token', accessToken);
   ```

4. **Logging**:
   Replace `console.log` with a library like `winston` for better log management.

5. **Security**:
   - Add HTTPS support with `https` module.
   - Implement rate limiting with `express-rate-limit`.

## Troubleshooting

- **"Missing required environment variables!"**:
  - Ensure `.env` exists and contains `UPSTOX_API_KEY`, `UPSTOX_API_SECRET`, and `UPSTOX_REDIRECT_URI`.
- **"Failed to fetch access token"**:
  - Verify credentials and redirect URI match the Upstox Developer Console.
  - Check network connectivity and Upstox API status.
- **WebSocket Doesn’t Connect**:
  - Ensure `accessToken` is valid (re-authenticate if expired).
  - Check firewall or proxy settings blocking `wss://` connections.
- **API Errors**:
  - Inspect error logs for response data (e.g., `error.response.data`).
  - Refer to [Upstox API Documentation](https://upstox.com/developer/api-documentation/open-API/).

## License

This project is unlicensed for now. Feel free to use, modify, and distribute it as needed. For production use, consider adding a formal license (e.g., MIT).

---