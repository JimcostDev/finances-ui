import type { HTMLAttributes, ReactNode } from "react";

/** Degradado y peso alineados con index / login (minimal, sin bold pesado). */
const GRADIENT =
  "font-semibold tracking-tight bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent";

const VARIANT_CLASSES = {
  gradient: GRADIENT,
  plain: "font-semibold tracking-tight text-slate-900",
  onDark: "font-semibold tracking-tight text-white",
} as const;

const SIZE_CLASSES = {
  sm: "text-2xl leading-[1.15]",
  md: "text-3xl leading-[1.15]",
  lg: "text-4xl leading-[1.1]",
  "responsive-sm": "text-2xl leading-[1.15] sm:text-3xl sm:leading-[1.1]",
  "responsive-md": "text-3xl leading-[1.15] sm:text-4xl sm:leading-[1.1]",
} as const;

export type TitleVariant = keyof typeof VARIANT_CLASSES;
export type TitleSize = keyof typeof SIZE_CLASSES;

export type TitleProps = {
  as?: "h1" | "h2" | "h3" | "p";
  variant?: TitleVariant;
  size?: TitleSize;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export default function Title({
  as: Component = "h2",
  variant = "gradient",
  size = "md",
  className = "",
  children,
  ...rest
}: TitleProps) {
  const v = VARIANT_CLASSES[variant];
  const s = SIZE_CLASSES[size];
  const balance = Component !== "p" ? "text-balance" : "";
  const merged = [v, s, balance, className].filter(Boolean).join(" ");
  return (
    <Component className={merged} {...rest}>
      {children}
    </Component>
  );
}

/** Misma ceja que index / auth: «Finanzas personales». Opcional encima de `<Title />`. */
export function TitleEyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={[
        "mb-6 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
