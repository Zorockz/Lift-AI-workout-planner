module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        'moduleName': '@env',
        'path': '.env',
        'blacklist': null,
        'whitelist': ['OPENAI_KEY', 'REV_CAT_IOS'],
        'safe': false,
        'allowUndefined': true,
      }],
      'react-native-reanimated/plugin',
    ],
  };
}; 