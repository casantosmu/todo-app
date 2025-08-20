import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ValidationError } from "@/lib/errors";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useSignup } from "../hooks/use-auth";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const { mutate, isPending } = useSignup();

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
        <Label htmlFor="email-signup">Email</Label>
        <Input
          ref={emailRef}
          id="email-signup"
          type="email"
          placeholder="email@example.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          required
        />
        {errors.email && (
          <p id="email-error" className="text-destructive text-sm">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <div className="relative">
          <Input
            ref={passwordRef}
            id="password-signup"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            aria-invalid={!!errors.password}
            aria-describedby="password-error"
            className="pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground absolute inset-y-0 right-0 w-10 focus-visible:ring-0"
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-destructive text-sm">
            {errors.password}
          </p>
        )}
      </div>

      {errors.general && (
        <p className="text-destructive text-sm">{errors.general}</p>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
          {!isPending && <UserPlus className="h-4 w-4" />}
        </Button>
        <Button type="button" variant="link" onClick={onSwitchToLogin}>
          Already have an account? Log in
        </Button>
      </div>
    </form>
  );
};
