// src/components/shared/copy-button.tsx
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  className?: string;
  tooltipText?: string;
}

export function CopyButton({ value, className, tooltipText = "Copy to clipboard" }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(value);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="icon-xs"
          variant="ghost"
          className={cn("h-6 w-6 text-muted-foreground hover:text-foreground", className)}
          onClick={onClick}
        >
          {hasCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          <span className="sr-only">{tooltipText}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{hasCopied ? "Copied!" : tooltipText}</TooltipContent>
    </Tooltip>
  );
}