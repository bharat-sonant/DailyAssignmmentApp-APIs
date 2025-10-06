import axios from "axios";
import { getActiveConnection } from "./firebaseClient";

let successStatus = "success";
let failStatus = "fail";



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
  const active = getActiveConnection();
  return active.firebaseStoragePath || null;
};
export const getCityStoragePath = () => {
  const active = getActiveConnection();

  return `${active.firebaseStoragePath}${active.cityName}` || null;
};
