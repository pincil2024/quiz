// netlify/functions/get-product-config.js
import { PRODUCT_CONFIG } from "./lynk-webhook.js";

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(PRODUCT_CONFIG),
  };
};
