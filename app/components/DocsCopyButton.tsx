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
      className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300"
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
