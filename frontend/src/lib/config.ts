const getEnvConfig = () => {
  return {
    syncServiceUrl: import.meta.env.VITE_SYNC_SERVICE_URL as string | undefined,
  };
};

export const getConfig = async () => {
  await Promise.resolve(); // Simulate async operations
  const envConfig = getEnvConfig();

  return {
    syncServiceUrl: envConfig.syncServiceUrl ?? "/api",
  };
};
