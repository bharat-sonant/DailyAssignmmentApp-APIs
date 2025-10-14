import { Controller, Post, Get, Body } from '@nestjs/common';
import { CityService } from './city.service';

/**
 * @class CityController
 * @description Handles HTTP requests for Firebase city connection and active city management.
 * Provides endpoints for connecting a Firebase instance to a selected city
 * and retrieving the currently active Firebase connection.
 * 
 * @author Ritik Parmar
 * @date 09 Oct 2025
 */
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  /**
   * @route POST /city/connect
   * @description Establishes a Firebase connection for the selected city.
   * Expects a configuration object (Firebase credentials) in the request body.
   * Delegates connection logic to CityService.
   * 
   * @param {object} body - Request body containing the `config` object with Firebase credentials.
   * @returns {object} Standardized response from CityService.
   */
  @Post('connect')
  connectCity(@Body() body: any) {
    return this.cityService.connectCity(body.config);
  }

  /**
   * @route GET /city/active
   * @description Retrieves details of the currently active Firebase city connection.
   * Useful for verifying which city’s Firebase instance is currently in use.
   * 
   * @returns {object} Standardized response from CityService.
   */
  @Get('active')
  getActiveCity() {
    return this.cityService.getActiveCity();
  }
}
