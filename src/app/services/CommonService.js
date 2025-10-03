import axios from "axios";
import { getActiveConnection } from "./firebaseClient";

let successStatus = "success";
let failStatus = "fail";

/**
 * @function getCityDetailsJson
 * @description 
 * Fetches the `CityDetails.json` file from Firebase Storage for the currently 
 * connected city/project. Uses the active `firebaseStoragePath` from the 
 * Firebase connection object to construct the request URL.
 * 
 * ✅ Success → Returns city list JSON data.  
 * ❌ Failure → Returns "City list unavailable." with error details.
 *
 * @returns {Promise<object>} Standard response object containing status, message, and data
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export const getCityDetailsJson = async () => {
  try {
    // Build the URL from the active storage path
    const url = `${getStoragePath()}Common%2FCityDetails%2FCityDetails.json?alt=media`;

    const res = await axios.get(url);

    if (res && res.data) {
      return setResponse(successStatus, "City list fetched successfully.", {
        service: "getCityDetailsJson",
        data: res.data,
      });
    } else {
      return setResponse(failStatus, "City list unavailable.", {
        service: "getCityDetailsJson",
        params: { res },
      });
    }
  } catch (error) {
    return setResponse(failStatus, "City list unavailable.", {
      service: "getCityDetailsJson",
      params: { error: error.message },
    });
  }
};

/**
 * @function setResponse
 * @description 
 * Generates a standardized response object for service functions.
 * Useful for maintaining consistency across all API/service outputs.
 * 
 * Example output:
 * ```json
 * { "status": "success", "msg": "Done", "data": { ... } }
 * ```
 *
 * @param {string} status - Response status (success/fail)
 * @param {string} msg - Message to describe the result
 * @param {object} [data={}] - Optional data payload
 * @returns {{status: string, msg: string, data: object}} Standard response format
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export const setResponse = (status, msg, data = {}) => {
  return { status, msg, data };
};

/**
 * @function getStoragePath
 * @description 
 * Retrieves the active Firebase Storage path (base URL) for the currently 
 * connected city/project from the active connection object.  
 * 
 * Example:
 * ```
 * https://firebasestorage.googleapis.com/v0/b/project-id.appspot.com/o/
 * ```
 * 
 * @returns {string|null} Firebase storage path URL, or null if no connection is active
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */
export const getStoragePath = () => {
  const { firebaseStoragePath } = getActiveConnection();
  return firebaseStoragePath || null;
};
export const getCityStoragePath = () => {
  const { firebaseStoragePath, cityName } = getActiveConnection();
  return `${firebaseStoragePath}${cityName}` || null;
};
