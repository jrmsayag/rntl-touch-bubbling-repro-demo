module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-gesture-handler)?|@react-native(-community)?)/)',
  ],
};
