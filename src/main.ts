/**
 * @file main.ts
 * @description Entry point for NestJS backend. Enables CORS, logs server URLs, and allows LAN access.
 * @author Ritik Parmar
 * @date 10 Oct 2025
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import os from 'os';

async function bootstrap() {
  // 🧠 Create the Nest application
  const app = await NestFactory.create(AppModule);

  // 🌐 Enable CORS for React Native frontend access
  app.enableCors({
    origin: '*', // Allow all origins (recommended: replace '*' with your app URL in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // Set true only if using cookies
  });

  // Optional: Prefix all routes (e.g. /api/city/connect)
  // app.setGlobalPrefix('api');

  // ⚙️ Server configuration
  const PORT = process.env.PORT || 3001;
  const HOST = '0.0.0.0'; // Allows external devices (phones, emulators) to connect

  // 🚀 Start server
  await app.listen(PORT, HOST);

  // 🧾 Log available URLs
  const logger = new Logger('Bootstrap');
  const localIp = getLocalIpAddress();
  logger.log(`🚀 Server running successfully!`);
  logger.log(`-------------------------------------------`);
  logger.log(`➡ Local URL:   http://localhost:${PORT}`);
  logger.log(`➡ Network URL: http://${localIp}:${PORT}`);
  logger.log(`-------------------------------------------`);
}

/**
 * @function getLocalIpAddress
 * @description Finds your current LAN IP address (used for network logging)
 * @returns {string} Local IPv4 address or 'localhost'
 */
function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// 🚀 Initialize backend
bootstrap();
