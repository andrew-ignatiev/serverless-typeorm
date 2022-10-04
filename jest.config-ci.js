/* eslint-disable @typescript-eslint/no-var-requires */
const { jest } = require('./package.json');

module.exports = {
  ...jest,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
