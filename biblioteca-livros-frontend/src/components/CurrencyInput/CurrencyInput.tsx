import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { formatBRL } from "../../features/livros/utils/currency";

export function CurrencyInput({
  value,
  onChange,
  className,
  id,
  name,
}: {
  value: number;
  onChange: (next: number) => void;
  className?: string;
  id?: string;
  name?: string;
}) {
  const [text, setText] = useState(() => formatBRL(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(formatBRL(value));
  }, [value, focused]);

  return (
    <input
      id={id}
      name={name}
      inputMode="decimal"
      placeholder="R$ 0,00"
      value={focused ? text : formatBRL(value)}
      onFocus={() => {
        setFocused(true);
        setText(formatBRL(value));
      }}
      onBlur={() => {
        setFocused(false);
        setText(formatBRL(value));
      }}
      onChange={(e) => {
        const raw = e.target.value;

        // Keep only digits and treat them as "cents" to format while typing.
        // Example: "1234" => R$ 12,34
        const digits = raw.replace(/\D/g, "");
        if (!digits) {
          setText("");
          onChange(0);
          return;
        }

        const cents = Number(digits);
        const next = Number.isFinite(cents) ? cents / 100 : 0;
        setText(formatBRL(next));
        onChange(next);
      }}
      className={cn(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text",
        "placeholder:text-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
        className,
      )}
    />
  );
}

