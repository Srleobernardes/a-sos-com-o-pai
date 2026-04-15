const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add PDF as recognized asset extension
config.resolver.assetExts.push('pdf');

const originalGetPolyfills = config.serializer.getPolyfills;
config.serializer.getPolyfills = function (options) {
  return [
    path.resolve(__dirname, 'url-polyfill.js'),
    ...(originalGetPolyfills ? originalGetPolyfills(options) : []),
  ];
};

module.exports = config;
