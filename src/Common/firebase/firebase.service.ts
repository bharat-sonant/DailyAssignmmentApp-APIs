import { Injectable, Logger } from '@nestjs/common';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * @interface FirebaseConnection
 * @description Defines a structure to hold Firebase app instances
 *              associated with specific city connections.
 */
interface FirebaseConnection {
  app: FirebaseApp;
  cityName: string;
  databaseURL: string;
  storagePath?: string;
  config: any;
}

/**
 * @class FirebaseService
 * @description Manages Firebase app initialization, registry, and
 *              active connection handling for multiple cities.
 *              Ensures only one Firebase app instance is active at a time.
 * 
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */
@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  /** 🗂️ Registry to store initialized Firebase app connections */
  private registry = new Map<string, FirebaseConnection>();

  /** 🔑 Active Firebase connection key */
  private activeKey: string | null = null;

  /**
   * @function connectCity
   * @description Connects or reuses an existing Firebase app for a city.
   * Automatically disconnects any previously active Firebase app.
   * @param {object} config - Firebase configuration object
   * @returns {FirebaseConnection} The new or reused Firebase connection
   */
  connectCity(config: any): FirebaseConnection {
    if (!config || !config.databaseURL) {
      this.logger.error('❌ Invalid Firebase configuration');
      throw new Error('Firebase configuration missing databaseURL');
    }

    const key = config.cityName || config.city || config.projectId;

    // ⚙️ If connecting to a *different* city, clear previous connection
    if (this.activeKey && this.activeKey !== key) {
      this.logger.warn(
        `🔁 Switching Firebase connection from ${this.activeKey} ➜ ${key}`,
      );
      this.cleanupPreviousConnection();
    }

    // ✅ Reuse if already connected
    if (this.registry.has(key)) {
      this.activeKey = key;
      this.logger.log(`⚡ Reusing existing Firebase connection for ${config.cityName}`);
      return this.registry.get(key)!;
    }

    try {
      // 🔁 Initialize new app or reuse existing SDK app
      const existingApp = getApps().find((a) => a.name === key);
      const app =
        existingApp ??
        initializeApp(
          {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            databaseURL: config.databaseURL,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId,
          },
          key,
        );

      // 💾 Register new connection
      const connection: FirebaseConnection = {
        app,
        cityName: config.cityName || 'Unknown City',
        databaseURL: config.databaseURL,
        storagePath: config.firebaseStoragePath || null,
        config,
      };

      this.registry.set(key, connection);
      this.activeKey = key;
      this.logger.log(`✅ Firebase connected for city: ${connection.cityName}`);

      return connection;
    } catch (error) {
      this.logger.error(`❌ Failed to initialize Firebase: ${error.message}`);
      throw error;
    }
  }

  /**
   * @function cleanupPreviousConnection
   * @description Clears previous city’s Firebase connection from registry
   *              to prevent memory leaks and duplicate apps.
   */
  private cleanupPreviousConnection() {
    if (this.activeKey && this.registry.has(this.activeKey)) {
      const oldKey = this.activeKey;
      this.registry.delete(oldKey);
      this.activeKey = null;
      this.logger.warn(`🧹 Previous Firebase connection (${oldKey}) removed.`);
    }
  }

  /** Returns active Realtime Database instance */
  getDatabase(): Database {
    const active = this.ensureActiveConnection();
    return getDatabase(active.app);
  }

  /** Returns active Firebase Storage instance */
  getStorage(): FirebaseStorage {
    const active = this.ensureActiveConnection();
    return getStorage(active.app);
  }

  /** Returns the currently active Firebase connection */
  getActiveConnection(): FirebaseConnection | null {
    return this.activeKey ? this.registry.get(this.activeKey)! : null;
  }

  /** Returns the configuration of the active Firebase connection */
  getCurrentFirebaseConfig(): object | null {
    if (!this.activeKey) {
      this.logger.warn('⚠️ No active Firebase connection found');
      return null;
    }

    const active = this.registry.get(this.activeKey);
    if (!active) return null;

    const { cityName, databaseURL, storagePath } = active;
    return {
      cityName,
      databaseURL,
     storagePath ,
    };
  }

  /** Ensures a valid Firebase connection is active */
  private ensureActiveConnection(): FirebaseConnection {
    if (!this.activeKey) {
      this.logger.error('❌ No active Firebase connection found');
      throw new Error('No active Firebase connection. Please connect a city first.');
    }

    const active = this.registry.get(this.activeKey);
    if (!active) {
      this.logger.error('❌ Active Firebase app not found in registry');
      throw new Error('Active Firebase connection missing from registry.');
    }

    return active;
  }
}
