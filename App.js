// App.js
import { registerRootComponent } from 'expo';
import { createRoot } from 'react-dom/client';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

// This is the main entry point for Expo
registerRootComponent(App);

// For web support
if (typeof document !== 'undefined') {
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
}