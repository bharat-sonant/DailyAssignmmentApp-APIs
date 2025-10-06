import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { loadFirebaseConfig, saveFirebaseConfig } from "../../config/firebaseConfigStore";

/**
 * @function initFirebase
 * @description Initializes Firebase dynamically with the given config object. 
 * If no config is passed, the last saved config is loaded from local storage (JSON file).
 * The connection persists until explicitly changed by another city selection.
 * @param {object} [connectObj=null] - Firebase configuration object
 * @returns {import("firebase/database").Database|null} Active Realtime Database instance
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export function initFirebase(connectObj = null) {
  try {
    // 1️⃣ Load saved config if not provided
    if (!connectObj) {
      connectObj = loadFirebaseConfig();
    }

    if (!connectObj || !connectObj.databaseURL) {
      throw new Error("Missing Firebase config or databaseURL");
    }

    const key = `${connectObj.projectId}_${connectObj.databaseURL}`;
    const appName = Buffer.from(key).toString("base64");

    // 2️⃣ Initialize or reuse Firebase app
    let app;
    if (getApps().some((a) => a.name === appName)) {
      app = getApp(appName);
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

    // 3️⃣ Get and return database instance
    const db = getDatabase(app);

    // 4️⃣ Save config persistently for future access
    saveFirebaseConfig(connectObj);

    return db;
  } catch (error) {
    console.error("❌ initFirebase Error:", error);
    return null;
  }
}

/**
 * @function getActiveConnection
 * @description Returns the last saved Firebase configuration (without initializing Firebase).
 * @returns {object|null} Last saved Firebase configuration object
 * @author Ritik Parmar
 * @date 06 Oct 2025
 */
export function getActiveConnection() {
  try {
    const savedConfig = loadFirebaseConfig();
    if (savedConfig) {
      return savedConfig;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * @function getCurrentDatabase
 * @description Returns the current Firebase Realtime Database instance 
 * from the initialized Firebase app, without reinitializing.
 * @returns {import("firebase/database").Database|null} Firebase Database instance
 * @author Ritik Parmar
 * @date 06 Oct 2025
 */
export function getCurrentDatabase() {
  try {
    const apps = getApps();
    if (apps.length > 0) {
      const currentApp = getApp(apps[0]);
      return getDatabase(currentApp);
    }

    return null;
  } catch (error) {
    return null;
  }
}
