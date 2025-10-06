
import axios from 'axios';
import * as common from '../CommonService';
let successStatus = 'success';
let failStatus = 'fail';

/**
 * @function getUserLogin
 * @description Checks username & password from city storage JSON and validates user status.
 * @param {string} username - User's login username
 * @param {string} password - User's login password
 * @returns {Promise<object>} Standard response with user details or error
 * @author Ritik Parmar
 * @date 03 Oct 2025
 */

export const getUserLogin = async (username, password) => {
  try {
    if (!username || !password ) {
      return common.setResponse(failStatus, "Login credential not found", {
        service: "getUserLogin",
        params: { username, password },
      });
    }

    // 🔹 Fetch JSON from storage
    let url = `${common.getCityStoragePath()}%2FWorkAssignmentUsers%2FWorkAssignmentUsers.json?alt=media`;
    const res = await axios.get(url);

    if (!res || !res.data) {
      return common.setResponse(failStatus, "User data not available for this city", {
        service: "getUserLogin",
        params: { url },
      });
    }

    const users = res.data;
    let foundUser = null;

    // 🔹 Iterate over user records (ignoring `lastKey`)
    Object.keys(users).forEach((key) => {
      if (key !== "lastKey") {
        const user = users[key];
        if (user.username === username && user.password === password) {
          foundUser = { id: key, ...user };
        }
      }
    });

    // 🔹 Check login validity
    if (!foundUser) {
      return common.setResponse(failStatus, "Invalid username or password", {
        service: "getUserLogin",
        params: { username },
      });
    }

    // 🔹 Check status
    if (foundUser.status !== "Active") {
      return common.setResponse(failStatus, "User is inactive", {
        service: "getUserLogin",
        params: { username, status: foundUser.status },
      });
    }

    // ✅ Success
    return common.setResponse(successStatus, "Login successfully", {
      service: "getUserLogin",
      data: foundUser,
    });
  } catch (error) {
    return common.setResponse(failStatus, "Login credential not found", {
      service: "getUserLogin",
      params: { error: error.message },
    });
  }
};
