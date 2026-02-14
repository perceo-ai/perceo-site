"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  if (variant === "primary") {
    return (
      <button
        className={`px-[20px] py-[10px] text-sm font-semibold text-white rounded-[5px] bg-gradient-to-b from-[#8b5cf6] to-[#7848e6] hover:from-[#7c3aed] hover:to-[#6d28d9] transition-colors ${className}`}
        style={style}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`relative overflow-clip px-[20px] py-[10px] text-sm font-semibold text-white rounded-[5px] transition-colors hover:bg-white/[0.08] ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        ...style,
      }}
      {...props}
    >
      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-[5px] pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      {children}
    </button>
  );
}
