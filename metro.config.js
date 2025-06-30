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

// Remove the watcher options that were causing validation warnings
// config.watcher = {
//   usePolling: true,
//   interval: 1000,
// };

module.exports = config;