// netlify/functions/lib/tokenManager.js
import admin from "firebase-admin";
require("dotenv").config();

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  console.log("🔍 ENV CHECK:", {
    projectId,
    clientEmail,
    hasPrivateKey: !!privateKey,
    privateKeySample: privateKey ? privateKey.substring(0, 40) + "..." : null,
  });

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("❌ Missing Firebase environment variables in Netlify!");
  }

  admin.initializeApp({
  credential: admin.credential.cert({
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, '\n'),
  }),
});

}

export const db = admin.firestore();

export async function assignTokenToUser(userId, contentId, { durationDays }) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  // Match the webhook structure
  await db.collection("users").doc(userId).set(
    {
      tokens: {
        [contentId]: {
          expiresAt: expiresAt.toISOString(),
          grantedAt: FieldValue.serverTimestamp(),
        }
      }
    },
    { merge: true }
  );

  console.log(`✅ Token assigned to user ${userId} for ${contentId}`);
}