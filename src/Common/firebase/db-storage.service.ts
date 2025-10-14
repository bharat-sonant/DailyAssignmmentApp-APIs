/**
 * @file db-storage.service.ts
 * @description 
 * Centralized service for Firebase Realtime Database and Storage operations.  
 * Provides unified and reusable methods for:
 *   - 🔹 Database CRUD (Create, Read, Update, Delete) operations
 *   - 🔹 File uploads, downloads, and deletions in Firebase Storage
 *   - 🔹 Axios-based file fetching via public Storage URLs
 *   - 🔹 Dynamic REST storage path generation (supports global & city-specific paths)
 * 
 * This service automatically uses the currently active Firebase connection 
 * from {@link FirebaseService}, ensuring all read/write actions are scoped 
 * to the selected city/project configuration.
 *
 * Example usage:
 *  - `setData()` / `getData()` → to manage real-time database records
 *  - `uploadFile()` / `deleteFile()` → to manage Firebase Storage files
 *  - `getFileData()` → to fetch binary data from a public file URL
 *  - `getStoragePath()` → to dynamically build Firebase Storage REST URLs
 *
 * @note Designed for multi-city Firebase setups with auto-managed active connections.
 *
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */

import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import axios from 'axios';
import {
  ref,
  get,
  set,
  update,
  remove,
} from 'firebase/database';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

@Injectable()
export class DbStorageService {
  private readonly logger = new Logger(DbStorageService.name);

  constructor(private readonly firebaseService: FirebaseService) { }

  // ---------------------------------------------------------------------------
  // 🗃️ Realtime Database Methods
  // ---------------------------------------------------------------------------

  /**
   * @function setData
   * @description Creates or replaces data at the given path.
   * @param {string} path - Firebase DB path
   * @param {any} data - Data to write
   */
  async setData(path: string, data: any) {
    const db = this.firebaseService.getDatabase();
    await set(ref(db, path), data);
    return { success: true, path, data };
  }

  /**
   * @function getData
   * @description Reads data once from a given path.
   * @param {string} path - Firebase DB path
   */
  async getData(path: string) {
    const db = this.firebaseService.getDatabase();
    const snapshot = await get(ref(db, path));
    const value = snapshot.exists() ? snapshot.val() : null;
    return value;
  }

  /**
   * @function updateData
   * @description Updates specific fields in a path (partial update).
   * @param {string} path - Firebase DB path
   * @param {any} data - Partial data to update
   */
  async updateData(path: string, data: any) {
    const db = this.firebaseService.getDatabase();
    await update(ref(db, path), data);
    return { success: true, path, data };
  }

  /**
   * @function deleteData
   * @description Removes data from a given path.
   * @param {string} path - Firebase DB path
   */
  async deleteData(path: string) {
    const db = this.firebaseService.getDatabase();
    await remove(ref(db, path));
    return { success: true, path };
  }



  // ---------------------------------------------------------------------------
  // ☁️ Firebase Storage Methods
  // ---------------------------------------------------------------------------

  /**
   * @function uploadFile
   * @description Uploads a file (Buffer or Blob) to Firebase Storage.
   * @param {string} path - Target storage path
   * @param {Buffer | Blob} file - File to upload
   */
  async uploadFile(path: string, file: Buffer | Blob) {
    const storage = this.firebaseService.getStorage();
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return { success: true, path, url };
  }

  /**
   * @function getFileData
   * @description Fetches and returns file content directly from Firebase Storage using its download URL.
   * @param {string} fileUrl - The public Firebase Storage download URL
   */
  async getFileData(fileUrl: string): Promise<Buffer | null> {
    try {
      if (!fileUrl) {
        this.logger.log(`⚠️ Invalid Firebase Storage URL: ${fileUrl}`);
        return null;
      }

      // Fetch binary data using Axios
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      return response.data;
    } catch (error) {
      return null;
    }
  }


  /**
   * @function deleteFile
   * @description Deletes a file from Firebase Storage.
   * @param {string} path - File path in Storage
   */
  async deleteFile(path: string) {
    const storage = this.firebaseService.getStorage();
    const fileRef = storageRef(storage, path);
    await deleteObject(fileRef);
    return { success: true, path };
  }
  /**
   * @function getStoragePath
   * @description Returns the correct Firebase Storage REST path URL.
   * Appends cityName only if type === 'city', ensuring clean slashes.
   * Example:
   *   - global → https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/
   *   - city   → https://firebasestorage.googleapis.com/v0/b/dtdnavigator.appspot.com/o/Sikar
   * @param {string} type - 'city' for city folder, anything else for global
   * @returns {string | null} Full Firebase Storage URL
   */
  async getStoragePath(type: string): Promise<string | null> {
    const config: any = this.firebaseService.getCurrentFirebaseConfig();

    if (!config) {
      this.logger.log('⚠️ No active Firebase connection found while building storage path');
      return null;
    }

    let basePath = config.storagePath?.trim();
    if (!basePath) {
      this.logger.log('❌ firebaseStoragePath missing in config');
      return null;
    }

    // 🧩 Ensure single trailing slash (clean format)
    if (!basePath.endsWith('/')) {
      basePath = `${basePath}/`;
    }

    // 🧠 Append city name only if type === 'city'
    const citySegment =
      type === 'city' && config.cityName
        ? `${config.cityName.trim()}`
        : '';

    const finalPath = `${basePath}${citySegment}`.replace(/\/+$/, '');
    return finalPath;
  }

}

