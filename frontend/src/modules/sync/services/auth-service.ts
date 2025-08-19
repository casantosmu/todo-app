import { getConfig } from "@/lib/config";
import { errorFromResponse, ValidationError } from "@/lib/errors";
import type { AuthLogin } from "../models/auth-login";
import type { AuthSession } from "../models/auth-session";
import type { AuthSignup } from "../models/auth-signup";
import type { AuthTokenResponse } from "../models/auth-token-response";

const SESSION_STORAGE_KEY = "auth-session";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authService = {
  async login(credentials: AuthLogin) {
    const { email, password } = credentials;
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(errors);
    }

    const config = await getConfig();

    const response = await fetch(`${config.syncServiceUrl}/auth/login`, {
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

    const { token } = (await response.json()) as AuthTokenResponse;

    const session: AuthSession = { token };
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

    const response = await fetch(`${config.syncServiceUrl}/auth/register`, {
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

    const loginResponse = await fetch(`${config.syncServiceUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!loginResponse.ok) {
      const error = await errorFromResponse(loginResponse);
      throw error;
    }

    const { token } = (await loginResponse.json()) as AuthTokenResponse;

    const session: AuthSession = { token };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async logout() {
    const config = await getConfig();

    const session = this.getSession();
    if (!session?.token) {
      throw new Error("User not authenticated, cannot logout.");
    }

    const response = await fetch(`${config.syncServiceUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.statusText}`);
    }

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
