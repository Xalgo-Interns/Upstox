const OrderService = require("../src/orders/orders");

describe("OrderService", () => {
  test("placeOrder should throw error on invalid details", async () => {
    await expect(OrderService.placeOrder("token", null)).rejects.toThrow(
      "Invalid order details"
    );
  });

  // Add more tests with mocked Axios responses
});
