import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useRef, type FormEvent } from "react";
import { useSignup } from "../hooks/use-auth";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending, error } = useSignup();

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
        <Label htmlFor="email-signup">Email</Label>
        <Input
          ref={emailRef}
          id="email-signup"
          type="email"
          placeholder="email@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-signup">Password</Label>
        <Input
          ref={passwordRef}
          id="password-signup"
          type="password"
          required
          minLength={8}
        />
      </div>

      {error && <p className="text-destructive text-sm">{error.message}</p>}

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
          {!isPending && <UserPlus />}
        </Button>
        <Button type="button" variant="link" onClick={onSwitchToLogin}>
          Already have an account? Log in
        </Button>
      </div>
    </form>
  );
};
