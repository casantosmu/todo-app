const config = {
  env: {
    isDev: import.meta.env.MODE === "development",
    isTest: import.meta.env.MODE === "test",
  },
};

export default config;
