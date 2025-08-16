// Script de depuración para verificar el estado de los tokens
// Copia y pega esto en la consola del navegador para depurar

console.log('=== DEBUGGING AUTH STATE ===');

// Verificar localStorage
console.log('📦 localStorage tokens:');
console.log('  accessToken:', localStorage.getItem('accessToken'));
console.log('  refreshToken:', localStorage.getItem('refreshToken'));
console.log('  tokenExpiration:', localStorage.getItem('tokenExpiration'));
console.log('  usuarioLogueado:', JSON.parse(localStorage.getItem('usuarioLogueado') || 'null'));

// Verificar si el token está expirado
const tokenExp = localStorage.getItem('tokenExpiration');
if (tokenExp) {
  const expDate = new Date(tokenExp);
  const now = new Date();
  const isExpired = now > expDate;
  const timeLeft = Math.floor((expDate.getTime() - now.getTime()) / 1000);
  
  console.log('⏰ Token expiration info:');
  console.log('  Expiration date:', expDate.toLocaleString());
  console.log('  Current time:', now.toLocaleString());
  console.log('  Is expired:', isExpired);
  console.log('  Time left (seconds):', timeLeft);
  console.log('  Is expiring soon (< 300s):', timeLeft <= 300);
}

// Verificar token JWT manualmente
const token = localStorage.getItem('accessToken');
if (token) {
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔑 JWT payload:', payload);
      console.log('  JWT exp:', new Date(payload.exp * 1000).toLocaleString());
      console.log('  JWT is valid:', Date.now() < payload.exp * 1000);
    }
  } catch (e) {
    console.error('❌ Error parsing JWT:', e);
  }
}

// Verificar Pinia store (si está disponible)
if (window.__PINIA__) {
  console.log('🍍 Pinia auth store state available');
  // Acceder al store si es posible
}

console.log('=== END DEBUG INFO ===');
