import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationError } from "@/lib/errors";
import { LogIn } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useLogin } from "../hooks/use-auth";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const { mutate, isPending } = useLogin();

  const handleError = (error: Error) => {
    if (error instanceof ValidationError) {
      setErrors((prev) => ({
        ...prev,
        ...error.fields,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        general: error.message,
      }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    mutate({ email, password }, { onError: handleError });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          aria-invalid={!!errors.email}
          aria-describedby="email-error-login"
        />
        {errors.email && (
          <p id="email-error-login" className="text-destructive text-sm">
            {errors.email}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          required
          aria-invalid={!!errors.password}
          aria-describedby="password-error-login"
        />
        {errors.password && (
          <p id="password-error-login" className="text-destructive text-sm">
            {errors.password}
          </p>
        )}
      </div>

      {errors.general && (
        <p className="text-destructive text-sm">{errors.general}</p>
      )}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Log in"}
          {!isPending && <LogIn />}
        </Button>
        <Button type="button" variant="link" onClick={onSwitchToSignup}>
          Don't have an account? Sign up
        </Button>
      </div>
    </form>
  );
};
