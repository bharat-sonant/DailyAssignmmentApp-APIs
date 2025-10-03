import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let _active = { db: null, appName: null, config: null, firebaseStoragePath: null };

/**
 * Initialize Firebase app + Realtime Database connection
 * and store active connection details globally.
 * @param {object} connectObj - Firebase config (apiKey, authDomain, databaseURL, etc.)
 * @returns {import("firebase/database").Database} Realtime Database instance
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description 
 * Dynamically initializes Firebase with the given project config
 * and sets the active database connection along with the storage path.
 */
export function initFirebase(connectObj) {
  const key = `${connectObj.projectId}_${connectObj.databaseURL}`;
  const appName = Buffer.from(key).toString("base64");

  let app;
  if (getApps().some((a) => a.name === appName)) {
    app = getApp(appName); // reuse existing app
  } else {
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
      appName
    );
  }

  const db = getDatabase(app);

  // 🔹 Save as active connection (include firebaseStoragePath)
  _active = { 
    db, 
    appName, 
    config: connectObj, 
    firebaseStoragePath: connectObj.firebaseStoragePath || null 
  };

  return db; // return active DB
}

/**
 * Get the latest active Firebase connection object.
 * @returns {{ db: import("firebase/database").Database|null, appName: string|null, config: object|null, firebaseStoragePath: string|null }}
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description Returns the currently active Firebase DB connection, config, and storage path.
 */
export function getActiveConnection() {
  return _active;
}

