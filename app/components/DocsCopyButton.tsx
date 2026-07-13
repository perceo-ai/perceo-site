"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";

type DocsCopyButtonProps = {
  value: string;
  label?: string;
};

export default function DocsCopyButton({ value, label = "Copy" }: DocsCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.05] px-2.5 text-xs font-medium text-zinc-400 transition hover:border-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
      {copied ? "Copied" : label}
    </button>
  );
}
