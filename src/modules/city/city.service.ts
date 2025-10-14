import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../Common/firebase/firebase.service';
import { setResponse } from '../../Common/utils/Common.utils';

/**
 * @class CityService
 * @description Handles Firebase city connection management
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */
@Injectable()
export class CityService {
  // ✅ NestJS Logger instance
  // private readonly logger = new Logger(CityService.name);

  constructor(private readonly firebaseService: FirebaseService) { }

  /**
   * @function connectCity
   * @description Connects to Firebase for the selected city.
   * If already connected, reuses the existing connection.
   * @param {object} config - Firebase configuration object
   * @returns Standardized response via setResponse()
   */
  connectCity(config: any) {
    const start = Date.now();

    try {
      if (!config || !config.databaseURL) {
        const duration = Date.now() - start;
        return setResponse(false, '❌ Invalid Firebase configuration', {}, duration, 400);
      }

      const connection = this.firebaseService.connectCity(config);
      const duration = Date.now() - start;
      return setResponse(
        true,
        `✅ Connected to Firebase for city: ${connection.cityName}`,
        { city: connection.cityName },
        duration,
        200
      );
    } catch (error) {
      const duration = Date.now() - start;
      return setResponse(false, '❌ Failed to connect Firebase city', { error: error.message }, duration, 500);
    }

  }

  /**
   * @function getActiveCity
   * @description Returns the currently active Firebase city connection
   * @returns Standardized response via setResponse()
   */
  getActiveCity() {
    const active = this.firebaseService.getActiveConnection();

    if (!active) {
      return setResponse(false, '⚠️ No active Firebase connection');
    }
    return setResponse(true, '✅ Active Firebase connection found', {
      city: active.cityName,
    });
  }
}
