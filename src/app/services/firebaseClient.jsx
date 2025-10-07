import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

/**
 * 🔹 Firebase App Registry (Safe across hot reloads)
 * Ensures only one Firebase app per city/project is active.
 */
const globalForFirebase = globalThis;
if (!globalForFirebase.firebaseRegistry) {
  globalForFirebase.firebaseRegistry = new Map();
}
const firebaseRegistry = globalForFirebase.firebaseRegistry;

/**
 * @function getFirebaseApp
 * @description Initializes or reuses Firebase app (per city/project)
 * Works both client-side and server-side.
 * @param {object} connectObj - Firebase config object
 * @returns {{ app, db, cityName, storagePath }}
 */
export function getFirebaseApp(connectObj) {
  if (!connectObj || !connectObj.databaseURL) {
    console.log("❌ Invalid Firebase configuration — databaseURL missing.");
    return null;
  }

  const key = connectObj.projectId || connectObj.city || connectObj.databaseURL;
  console.log("🧠 Firebase app key:", key);

  // ✅ 1. Reuse existing app if found
  if (firebaseRegistry.has(key)) {
    console.log("♻️ Reusing existing Firebase app:", key);
    return firebaseRegistry.get(key);
  }

  // 🔁 2. If different app is active, clear registry
  const existingKeys = Array.from(firebaseRegistry.keys());
  if (existingKeys.length > 0 && existingKeys[0] !== key) {
    console.log(`🔁 Switching Firebase app: ${existingKeys[0]} → ${key}`);
    firebaseRegistry.clear();
  }

  // 🚀 3. Initialize new app safely
  let app;
  const existingApp = getApps().find((a) => a.name === key);
  if (existingApp) {
    console.log("♻️ Found existing Firebase app instance via getApps()");
    app = getApp(key);
  } else {
    console.log("🚀 Initializing new Firebase app for:", key);
    app = initializeApp(
      {
        apiKey: connectObj.apiKey,
        authDomain: connectObj.authDomain,
        databaseURL: connectObj.databaseURL,
        projectId: connectObj.projectId,
        storageBucket: connectObj.storageBucket,
        messagingSenderId: connectObj.messagingSenderId,
        appId: connectObj.appId,
      },
      key
    );
  }

  // 🔗 4. Initialize database and optional storagePath
  const db = getDatabase(app);
  const storagePath = connectObj.firebaseStoragePath || null;

  // 💾 5. Register this app globally
  const connection = { app, db, cityName: connectObj.cityName, storagePath };
  firebaseRegistry.set(key, connection);

  console.log(`✅ Firebase initialized for: ${connectObj.cityName || key}`);
  return connection;
}

/**
 * @function getActiveFirebaseConnection
 * @description Returns the currently active Firebase connection
 * @returns {{ app, db, cityName, storagePath } | null}
 */
export function getActiveFirebaseConnection() {
  const existingKeys = Array.from(firebaseRegistry.keys());
  if (existingKeys.length === 0) {
    console.warn("⚠️ No active Firebase connection found.");
    return null;
  }

  const key = existingKeys[0];
  const connection = firebaseRegistry.get(key);
  console.log(`📡 Active Firebase connection: ${connection.cityName || key}`);
  return connection;
}
