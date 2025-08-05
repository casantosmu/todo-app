import { sleep } from "@/lib/utils";
import type { AuthSession } from "../models/auth-session";

const SESSION_STORAGE_KEY = "auth-session";

export const authService = {
  async login(credentials: { email: string; password: string }) {
    await sleep(500); // Simulate network latency

    if (credentials.password.length < 6) {
      throw new Error("Password is too short.");
    }

    const session: AuthSession = {
      user: {
        id: crypto.randomUUID(),
        email: credentials.email,
      },
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async signup(credentials: { email: string; password: string }) {
    await sleep(500); // Simulate network latency

    if (credentials.password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    // In a real app, you'd check if the email is already taken.

    const session: AuthSession = {
      user: {
        id: crypto.randomUUID(),
        email: credentials.email,
      },
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },

  getSession() {
    const sessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionStr) {
      return null;
    }
    try {
      return JSON.parse(sessionStr) as AuthSession;
    } catch {
      return null;
    }
  },
};
