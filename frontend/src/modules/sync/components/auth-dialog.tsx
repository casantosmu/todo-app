import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LoginForm } from "./auth-login-form";
import { SignupForm } from "./auth-signup-form";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const AuthDialog = ({ isOpen, onOpenChange }: AuthDialogProps) => {
  const [view, setView] = useState<"login" | "signup">("login");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {view === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
        </DialogHeader>
        {view === "login" ? (
          <LoginForm
            onSwitchToSignup={() => {
              setView("signup");
            }}
          />
        ) : (
          <SignupForm
            onSwitchToLogin={() => {
              setView("login");
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
