import { useAuth } from "@/modules/sync/providers/auth-provider-context";
import { useMutation } from "@tanstack/react-query";
import type { AuthLogin } from "../models/auth-login";
import type { AuthSignup } from "../models/auth-signup";
import { authService } from "../services/auth-service";

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useMutation({
    mutationFn: (data: AuthLogin) => authService.login(data),
    onSuccess: onLogin,
  });
};

export const useSignup = () => {
  const { onLogin } = useAuth();

  return useMutation({
    mutationFn: (data: AuthSignup) => authService.signup(data),
    onSuccess: onLogin,
  });
};
