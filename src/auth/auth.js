const axios = require("axios");
const qs = require("qs");
const config = require("../config");

class AuthService {
  static getLoginUrl() {
    try {
      const params = {
        client_id: config.apiKey,
        redirect_uri: config.redirectUri,
        response_type: "code",
        state: "some_state", // Optional for security
      };
      console.log("Generated params:", params); // Add this
      const queryString = qs.stringify(params);
      return `${config.baseUrl}/login/authorization/dialog?${queryString}`;
    } catch (error) {
      console.error("Error generating login URL:", error.message);
      throw new Error("Failed to generate login URL");
    }
  }

  static async getAccessToken(code) {
    try {
      const response = await axios.post(
        `${config.baseUrl}/login/authorization/token`,
        qs.stringify({
          grant_type: "authorization_code",
          client_id: config.apiKey,
          client_secret: config.apiSecret,
          redirect_uri: config.redirectUri,
          code,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch access token");
    }
  }
}

module.exports = AuthService;
