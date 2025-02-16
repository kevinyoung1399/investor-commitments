export const environment = {
  apiUrl: import.meta.env.VITE_API_URL,
} as const;

Object.entries(environment).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
});
