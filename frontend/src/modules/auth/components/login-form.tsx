import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useRef, type FormEvent } from "react";
import { useLogin } from "../hooks/use-auth";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, error } = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      mutate({ email, password });
    }
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
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      {error && <p className="text-destructive text-sm">{error.message}</p>}

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
