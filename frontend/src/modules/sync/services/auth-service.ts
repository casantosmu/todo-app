import { getConfig } from "@/lib/config";
import { errorFromResponse, ValidationError } from "@/lib/errors";
import { sleep } from "@/lib/utils";
import type { AuthLogin } from "../models/auth-login";
import type { AuthSession } from "../models/auth-session";
import type { AuthSignup } from "../models/auth-signup";
import type { AuthUser } from "../models/auth-user";

const SESSION_STORAGE_KEY = "auth-session";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authService = {
  async login(credentials: AuthLogin) {
    await sleep(500); // Simulate network latency

    if (credentials.password.length < 6) {
      throw new Error("Password is too short.");
    }

    const now = new Date().toISOString();

    const session: AuthSession = {
      user: {
        id: crypto.randomUUID(),
        email: credentials.email,
        updatedAt: now,
        createdAt: now,
      },
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async signup(credentials: AuthSignup) {
    const { email, password, confirmPassword } = credentials;
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    const config = await getConfig();
    const response = await fetch(`${config.syncServiceUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await errorFromResponse(response);
      throw error;
    }

    const user = (await response.json()) as AuthUser;

    const session: AuthSession = { user };
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

    return JSON.parse(sessionStr) as AuthSession;
  },
};
