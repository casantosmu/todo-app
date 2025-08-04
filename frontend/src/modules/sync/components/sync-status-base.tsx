import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Popover } from "@radix-ui/react-popover";
import type { ReactNode } from "react";

interface SyncStatusBaseProps {
  trigger: {
    icon: ReactNode;
    ariaLabel: string;
  };
  content: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: {
      label: string;
      icon: ReactNode;
      onSelect: () => void;
    };
  };
}

export const SyncStatusBase = ({ trigger, content }: SyncStatusBaseProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={trigger.ariaLabel}>
          {trigger.icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="p-3">
          <div className="flex items-center gap-2">
            {content.icon}
            <span>{content.title}</span>
          </div>
          <p className="text-muted-foreground pt-2 text-sm">
            {content.description}
          </p>
        </div>
        {content.action && (
          <>
            <Separator />
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={content.action.onSelect}
            >
              {content.action.icon}
              <span>{content.action.label}</span>
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
