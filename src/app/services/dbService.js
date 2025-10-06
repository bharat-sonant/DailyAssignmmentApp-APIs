import { ref, get, set, remove, update } from "firebase/database";
import {  getCurrentDatabase } from "./firebaseClient";

/**
 * Fetch data from the Realtime Database at the given path.
 * @param {string} path - Realtime DB path
 * @returns {Promise<any>} The data stored at the path, or null if not found
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description Uses Firebase `get()` to read data from the currently active DB connection.
 */
export const getData = (path) => {
  const database = getDb();
  return new Promise((resolve) => {
    get(ref(database, path)).then((snapshot) => {
      let data = snapshot.val();
      resolve(data);
    });
  });
};

/**
 * Save (merge/update) data at a given path in the Realtime Database.
 * @param {string} path - Realtime DB path
 * @param {object} data - Data object to save
 * @returns {Promise<string>} "success" when update is complete
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description Uses Firebase `update()` to merge the given object with existing data at the path.
 */
export const saveData = (path, data) => {
  const database = getDb();
  return new Promise((resolve) => {
    update(ref(database, path), data);
    resolve("success");
  });
};

/**
 * Set (overwrite) data at a given path in the Realtime Database.
 * @param {string} path - Realtime DB path
 * @param {any} value - Data to overwrite at the path
 * @returns {Promise<string>} "success" when overwrite is complete
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description Uses Firebase `set()` to replace data at the path with the provided value.
 */
export const setData = (path, value) => {
  const database = getDb();
  return new Promise((resolve) => {
    set(ref(database, path), value);
    resolve("success");
  });
};

/**
 * Remove data at the given path in the Realtime Database.
 * @param {string} path - Realtime DB path
 * @returns {Promise<string>} "success" when removal is complete
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description Uses Firebase `remove()` to delete all data stored at the given path.
 */
export const RemoveData = (path) => {
  const database = getDb();
  return new Promise((resolve) => {
    remove(ref(database, path));
    resolve("success");
  });
};

/**
 * Get the latest active Firebase Realtime Database instance.
 * @returns {import("firebase/database").Database | null} Active Realtime DB instance or null if not set
 * @author Ritik Parmar
 * @date 03 Oct 2025
 * @description 
 * Reads the active Firebase connection stored by the `Connect-Database` API call 
 * in `firebaseClient`. Returns `null` if no database connection is currently active.
 */
function getDb() {
  const db = getCurrentDatabase();
  if (!db) return null; // safer than throwing, caller can handle null
  return db;
}

