import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';

/**
 * @controller LoginController
 * @description Handles login requests and delegates user validation
 *              to the LoginService using Firebase-based authentication.
 * @route POST /login
 * @date 09 Oct 2025
 * @author Ritik Parmar
 */
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /**
   * @function login
   * @description Accepts login credentials (username, password) from frontend
   *              and validates the user using Firebase Storage data.
   * @param {object} body - The request body containing { username, password }
   * @returns {Promise<object>} Standardized response via setResponse()
   */
  @Post()
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    return this.loginService.getUserLogin(username, password);
  }
}
