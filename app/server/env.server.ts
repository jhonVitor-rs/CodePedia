import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string(),
  NODE_ENV: z.string(),
  CLOUD_NAME: z.string(),
  API_KEY: z.string(),
  API_SECRET: z.string(),
});

type Env = z.infer<typeof envSchema>;

declare global {
  var ENV: Env;
  interface Window {
    ENV: Env;
  }
}

export function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Error parsing environment variables:', error);
    throw new Error('Failed to parse environment variables.');
  }
}