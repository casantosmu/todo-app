import { useAuth } from "@/modules/sync/providers/auth-provider-context";
import { useMutation } from "@tanstack/react-query";
import type { AuthCredentials } from "../models/auth-credentials";
import type { AuthSession } from "../models/auth-session";
import { authService } from "../services/auth-service";

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useMutation<AuthSession, Error, AuthCredentials>({
    mutationFn: (data: AuthCredentials) => authService.login(data),
    onSuccess: onLogin,
    onError: (error: unknown) => {
      console.error("Error during login:", error);
    },
  });
};

export const useSignup = () => {
  const { onLogin } = useAuth();

  return useMutation<AuthSession, Error, AuthCredentials>({
    mutationFn: (data: AuthCredentials) => authService.signup(data),
    onSuccess: onLogin,
    onError: (error: unknown) => {
      console.error("Error during signup:", error);
    },
  });
};
