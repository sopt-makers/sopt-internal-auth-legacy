const config = {
  testMatch: ["**/test/**/*.+(ts)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};

module.exports = config;
