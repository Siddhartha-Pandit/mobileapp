const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add wasm to the asset extensions (required by expo-sqlite web)
config.resolver.assetExts.push('wasm');

// expo-sqlite on web uses SharedArrayBuffer via a Worker.
// SharedArrayBuffer requires these two Cross-Origin isolation headers to be
// present on EVERY response (including the bundle itself).
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      middleware(req, res, next);
    };
  },
};

module.exports = config;
