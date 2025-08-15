import { useAuth } from "@/modules/sync/providers/auth-provider-context";
import { useMutation } from "@tanstack/react-query";
import type { AuthLogin } from "../models/auth-login";
import type { AuthSession } from "../models/auth-session";
import type { AuthSignup } from "../models/auth-signup";
import { authService } from "../services/auth-service";

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useMutation<AuthSession, Error, AuthLogin>({
    mutationFn: (data: AuthLogin) => authService.login(data),
    onSuccess: onLogin,
    onError: (error: unknown) => {
      console.error("Error during login:", error);
    },
  });
};

export const useSignup = () => {
  const { onLogin } = useAuth();

  return useMutation<AuthSession, Error, AuthSignup>({
    mutationFn: (data: AuthSignup) => authService.signup(data),
    onSuccess: onLogin,
    onError: (error: unknown) => {
      console.error("Error during signup:", error);
    },
  });
};
