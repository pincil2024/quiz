// netlify/functions/lynk-webhook.js
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// --------------------
// Firebase Admin Init
// --------------------
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

// --------------------
// Product Config
// --------------------
export const PRODUCT_CONFIG = {
  // Books
  "book-mimpiku-sekolah": { contentId: "book-mimpiku-sekolah", durationDays: 30 },
  "book-gadis-kecil": { contentId: "book-gadis-kecil", durationDays: 30 },
  "book-forest-teamwork": { contentId: "book-forest-teamwork", durationDays: 30 },

  // English quizzes
  "quiz-english-level-1": { contentId: "quiz-english-level-1", durationDays: 30 },
  "quiz-english-level-2": { contentId: "quiz-english-level-2", durationDays: 30 },
  "quiz-english-level-3": { contentId: "quiz-english-level-3", durationDays: 30 },

  // Bahasa quizzes
  "quiz-bahasa-level-1": { contentId: "quiz-bIndo-level-1", durationDays: 30 },
  "quiz-bahasa-level-2": { contentId: "quiz-bIndo-level-2", durationDays: 30 },

  // Math quizzes
  "quiz-math-level-1": { contentId: "quiz-mtk-level-1", durationDays: 30 },
  "quiz-math-level-2": { contentId: "quiz-mtk-level-2", durationDays: 30 },

  // Science quizzes
  "quiz-science-level-1": { contentId: "quiz-science-level-1", durationDays: 30 },
 // Bundles
  "all-access": { contentId: "all-access", durationDays: 30, bundle: true },
  // ✅ Premium-only access
  "premium-only": { contentId: "premium-only", durationDays: 30 },
};

// --------------------
// Lynk Title Mapping
// --------------------
const LYNK_TO_PRODUCT_MAPPING = {
  "Mimpiku, Sekolah untuk semua": "book-mimpiku-sekolah",
  "Buku Pdf “Gadis Kecil dan Jendela ke Dunia”": "book-gadis-kecil",
  "Festival Hutan Raya Buku Cerita Dwibahasa (Inggris & Indonesia)": "book-forest-teamwork",

  // ✅ Premium-only product
  "Pincil Premium (Tanpa Premium Buku dan Kuis )": "premium-only",
  "Pincil Premium (All Access)": "all-access",

};
// --------------------
// Assign Token Helper
// --------------------
async function assignTokenToUser(userId, contentId, { durationDays }) {
  console.log(`🔐 Assigning token for: ${userId}, content: ${contentId}`);

  const now = new Date().toISOString();
  const tokenData = {
    grantedAt: now,             // when it was given
    durationDays,               // how long it will last once activated
    active: false,              // ❌ keep inactive until user claims
    expiresAt: null             // ❌ only set after activation
  };

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    const userExists = userDoc.exists;

    if (userExists) {
      // User exists - add token to their account
      const userData = userDoc.data() || {};
      const currentTokens = userData.tokens || {};

      await userRef.update({
        [`tokens.${contentId}`]: tokenData,
        lastUpdated: now,
      });

      console.log(`✅ Updated existing user with pending token: ${userId}`);
    } else {
      // User doesn't exist yet - save to pendingTokens
      const pendingRef = db.collection("pendingTokens").doc(userId);
      const pendingDoc = await pendingRef.get();

      const pendingExists = pendingDoc.exists;
      const pendingData = pendingExists ? pendingDoc.data() : {};
      const pendingTokens = pendingData.tokens || {};

      await pendingRef.set({
        tokens: {
          ...pendingTokens,
          [contentId]: tokenData,
        },
        email: userId,
        createdAt: now,
        lastUpdated: now,
      }, { merge: true });

      console.log(`📋 Saved to pending tokens for later claim: ${userId}`);
    }

    return true;
  } catch (err) {
    console.error("❌ Error in assignTokenToUser:", err);
    throw err;
  }
}

// --------------------
// Webhook Handler
// --------------------
export async function handler(event) {
  console.log("🔔 Webhook received");

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const payload = JSON.parse(event.body);
    console.log("📩 Event type:", payload.event);

    if (payload.event !== "payment.received") {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Ignored non-payment event" }),
      };
    }

    const customer = payload.data?.message_data?.customer;
    const items = payload.data?.message_data?.items;

    if (!customer?.email || !items?.[0]?.title) {
      return { statusCode: 400, body: "Invalid payload" };
    }

    const userId = customer.email.toLowerCase();
    const productTitle = items[0].title;

    console.log(`🛒 Processing: ${userId} bought "${productTitle}"`);

    const productId = LYNK_TO_PRODUCT_MAPPING[productTitle];
console.log(`🔍 Looking up product mapping: "${productTitle}" -> "${productId}"`);

if (!productId) {
  console.log(`❌ Product not mapped: "${productTitle}"`);
  console.log(`📋 Available mappings:`, Object.keys(LYNK_TO_PRODUCT_MAPPING));
  
  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: `Product not mapped: ${productTitle}` }),
  };
}

   const productConfig = PRODUCT_CONFIG[productId];
console.log(`⚙️ Product config:`, productConfig);

if (!productConfig) {
  console.log(`❌ Product config not found for: ${productId}`);
  return {
    statusCode: 400,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: `Product config not found: ${productId}` }),
  };
}
    await assignTokenToUser(userId, productConfig.contentId, {
      durationDays: productConfig.durationDays,
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
