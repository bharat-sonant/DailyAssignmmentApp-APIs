/**
 * @file login.service.ts
 * @description Handles user authentication using Firebase Storage JSON data.
 * Fetches city-specific `WorkAssignmentUsers.json`, validates credentials and status.
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */

import { Injectable } from '@nestjs/common';
import { DbStorageService } from '../../Common/firebase/db-storage.service';
import { setResponse } from '../../Common/utils/Common.utils';



@Injectable()
export class LoginService {
    // private readonly logger = new Logger(LoginService.name);

    constructor(private readonly dbStorage: DbStorageService) { }

    /**
     * @function getUserLogin
     * @description Checks username & password from city storage JSON and validates user status.
     * @param {string} username - User's login username
     * @param {string} password - User's login password
     * @returns {Promise<object>} Standard response with user details or error
     * @author Ritik Parmar
     * @date 09 Oct 2025
     */
 async getUserLogin(username: string, password: string) {
  const start = Date.now(); // ⏱️ Start timer

  try {
    // 🧠 Step 1: Validate input
    if (!username || !password) {
      const duration = Date.now() - start;
      return setResponse(
        false,
        'Login credentials not found',
        { username, password },
        duration,
        400
      );
    }

    // 🧠 Step 2: Fetch user JSON from Firebase Storage
    const storagePath = await this.dbStorage.getStoragePath('city');
    const url = `${storagePath}%2FWorkAssignmentUsers%2FWorkAssignmentUsers.json?alt=media`;

    const fileBuffer = await this.dbStorage.getFileData(url);
    if (!fileBuffer) {
      const duration = Date.now() - start;
      return setResponse(
        false,
        'Login credentials not found',
        { service: 'getUserLogin', storagePath: url },
        duration,
        404
      );
    }

    // 🧠 Step 3: Parse JSON data
    const jsonText = Buffer.from(fileBuffer).toString('utf-8');
    const users = JSON.parse(jsonText);
    let foundUser: any = null;

    // 🧠 Step 4: Find matching user
    for (const key of Object.keys(users)) {
      if (key !== 'lastKey') {
        const user = users[key];
        if (user.username === username && user.password === password) {
          foundUser = { id: key, ...user };
          break;
        }
      }
    }

    // 🧠 Step 5: Validate user
    if (!foundUser) {
      const duration = Date.now() - start;
      return setResponse(false, 'Invalid username or password', { username }, duration, 401);
    }

    if (foundUser.status !== 'Active') {
      const duration = Date.now() - start;
      return setResponse(
        false,
        'Inactive user ID. Please contact the administrator.',
        { username },
        duration,
        403
      );
    }

    // ✅ Step 6: Success
    const duration = Date.now() - start;
    return setResponse(true, 'Login successful', { user: foundUser }, duration, 200);

  } catch (error) {
    const duration = Date.now() - start;
    return setResponse(
      false,
      'Login process failed',
      { error: error.message },
      duration,
      500
    );
  }
}


}
