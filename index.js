import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    console.error('🔴 Global unhandled rejection:', reason);
    alert(
      'Unhandled async error: ' +
        (reason instanceof Error
          ? reason.message
          : typeof reason === 'object'
          ? JSON.stringify(reason)
          : String(reason))
    );
  });
}