import { useAuth } from "@/providers/auth-provider/context";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth-service";

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useMutation({
    mutationFn: authService.login.bind(authService),
    onSuccess: onLogin,
  });
};

export const useSignup = () => {
  const { onLogin } = useAuth();

  return useMutation({
    mutationFn: authService.signup.bind(authService),
    onSuccess: onLogin,
  });
};
