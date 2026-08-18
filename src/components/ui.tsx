import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function PrimaryButton({
  children,
  className = '',
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-terracotta-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-terracotta-500/20 transition-colors hover:bg-terracotta-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  className = '',
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-teal-600/30 bg-white px-6 py-3.5 text-base font-semibold text-teal-700 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({
  children,
  className = '',
  ...rest
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-700/70 transition-colors hover:bg-cream-200 hover:text-ink-900 ${className}`}
      {...(rest as any)}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-3xl border border-terracotta-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function ScreenShell({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function EyebrowTitle({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-8 text-center sm:mb-10">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ochre-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ochre-700">
        {icon}
        {eyebrow}
      </div>
      <h1 className="font-display text-3xl font-semibold leading-tight text-ink-900 sm:text-4xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-base text-ink-700/70 sm:text-lg">{subtitle}</p>}
    </div>
  );
}

export function FieldLabel({
  children,
  hint,
}: PropsWithChildren<{ hint?: string }>) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <label className="text-sm font-bold text-ink-800">{children}</label>
      {hint && <span className="text-xs text-ink-700/50">{hint}</span>}
    </div>
  );
}

export function EditableTag({
  label,
  tone = 'terracotta',
}: {
  label: string;
  tone?: 'terracotta' | 'teal' | 'ochre';
}) {
  const tones: Record<string, string> = {
    terracotta: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    ochre: 'bg-ochre-50 text-ochre-800 border-ochre-200',
  };
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard may be unavailable; ignore */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition-colors hover:bg-teal-100"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

export function ConfidenceBadge({ level }: { level: 'estimated' | 'likely' | 'uncertain' }) {
  const map = {
    estimated: { text: 'AI estimate — please check', cls: 'bg-ochre-100 text-ochre-800' },
    likely: { text: 'AI guess — likely', cls: 'bg-teal-100 text-teal-800' },
    uncertain: { text: 'Uncertain — please confirm', cls: 'bg-terracotta-100 text-terracotta-700' },
  } as const;
  const m = map[level];
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${m.cls}`}>{m.text}</span>;
}
