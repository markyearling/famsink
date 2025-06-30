// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [];
config.server = {
  port: 8081,
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// 🔥 Fixed: Changed 'watch' to 'watcher' to resolve Metro validation warning
config.watcher = {
  usePolling: true,
  interval: 1000, // Optional: milliseconds between checks
};

module.exports = config;