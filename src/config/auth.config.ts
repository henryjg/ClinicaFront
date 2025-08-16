// src/config/auth.config.ts
/**
 * Configuración de autenticación - ESTANDARIZADA
 * Todos los tiempos están en SEGUNDOS para consistencia
 */

// Tiempo de expiración del token en segundos antes de renovar
export const TOKEN_EXPIRY_THRESHOLD_SECONDS = 300; // 5 minutos

// Tiempo de vida del token por defecto (informativo)
export const DEFAULT_TOKEN_LIFETIME_SECONDS = 3600; // 1 hora

// Configuraciones de timeout para requests
export const API_TIMEOUT_SECONDS = 30; // 30 segundos
