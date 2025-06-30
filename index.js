import { registerRootComponent } from 'expo';
import App from './App';

// Register the root app for Expo (required)
registerRootComponent(App);

// 🌐 Global unhandled promise rejection tracking
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    let message;

    try {
      message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'object'
          ? JSON.stringify(reason)
          : String(reason);
    } catch {
      message = '[unstringifiable error]';
    }

    console.error('🔴 [Window] Unhandled Promise Rejection:', reason);

    // Show alert (only for dev — remove in prod)
    alert(`🚨 Unhandled async error:\n${message}`);
  });
}

// 🖥️ Optional: Node-style global rejection handling (useful in SSR or web CLI)
if (typeof process !== 'undefined' && process.on) {
  process.on('unhandledRejection', (reason) => {
    let message;

    try {
      message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'object'
          ? JSON.stringify(reason)
          : String(reason);
    } catch {
      message = '[unstringifiable error]';
    }

    console.error('🔴 [Node] Unhandled Promise Rejection:', message);
  });
}