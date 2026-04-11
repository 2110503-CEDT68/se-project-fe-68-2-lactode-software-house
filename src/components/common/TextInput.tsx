"use client";

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  name?: string;
  className?: string;
};

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  name,
  className = "",
}: TextInputProps) {
  return (
    <div className={`flex w-full flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-gray-400 focus:border-[var(--color-primary)]"
      />
    </div>
  );
}