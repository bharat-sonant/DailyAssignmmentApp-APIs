import * as firebaseFunction from "./firebaseClient";

/**
 * @function setResponse
 * @description 
 * Creates a standardized response object for consistent API or service outputs.
 *
 * Example:
 * ```json
 * { "status": "success", "msg": "Done", "data": { ... } }
 * ```
 *
 * @param {string} status - Response status (e.g., "success" or "fail").
 * @param {string} msg - Description or message of the result.
 * @param {object} [data={}] - Optional data payload.
 * @returns {{status: string, msg: string, data: object}} Standardized response object.
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export const setResponse = (status, msg, data = {}) => {
  return { status, msg, data };
};

/**
 * @function getStoragePath
 * @description 
 * Returns the Firebase Storage base URL for the currently active city/project.
 *
 * Example:
 * ```
 * https://firebasestorage.googleapis.com/v0/b/project-id.appspot.com/o/
 * ```
 *
 * @returns {string|null} Storage base URL or null if no connection is active.
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export const getStoragePath = () => {
  const { storagePath } = firebaseFunction.getActiveFirebaseConnection() || {};
  return storagePath;
};

/**
 * @function getCityStoragePath
 * @description 
 * Returns the Firebase Storage path for the active city.
 *
 * Example:
 * ```
 * https://firebasestorage.googleapis.com/v0/b/project-id.appspot.com/o/CityName
 * ```
 *
 * @returns {string|null} Full city-specific storage path or null if unavailable.
 * author Ritik Parmar
 * date 03 Oct 2025
 */
export const getCityStoragePath = () => {
  const { cityName, storagePath } = firebaseFunction.getActiveFirebaseConnection() || {};
  return `${storagePath}${cityName}` || null;
};
