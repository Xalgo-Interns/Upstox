const axios = require("axios");
const config = require("../config");

class OrderService {
  static async placeOrder(accessToken, orderDetails) {
    try {
      if (!orderDetails || typeof orderDetails !== "object") {
        throw new Error("Invalid order details");
      }

      const response = await axios.post(
        `${config.baseUrl}/order/place`,
        orderDetails,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      throw new Error("Failed to place order");
    }
  }

  static async cancelOrder(accessToken, orderId) {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await axios.delete(
        `${config.baseUrl}/order/cancel?order_id=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error canceling order:",
        error.response?.data || error.message
      );
      throw new Error("Failed to cancel order");
    }
  }

  static async modifyOrder(accessToken, orderId, modifications) {
    try {
      if (!orderId || !modifications || typeof modifications !== "object") {
        throw new Error("Invalid order ID or modifications");
      }

      const response = await axios.put(
        `${config.baseUrl}/order/modify?order_id=${orderId}`,
        modifications,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error modifying order:",
        error.response?.data || error.message
      );
      throw new Error("Failed to modify order");
    }
  }
}

module.exports = OrderService;
