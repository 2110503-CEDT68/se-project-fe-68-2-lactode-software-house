"use client";

import React from "react";

type ButtonVariant =
  | "primary"
  | "primaryWithIcon"
  | "danger"
  | "outlineDanger"
  | "disabled"
  | "back";

type StyledButtonProps = {
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

export default function StyledButton({
  variant = "primary",
  children,
  onClick,
  type = "button",
  disabled = false,
  icon,
  className = "",
}: StyledButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition";

  const variantClass = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    primaryWithIcon:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    danger:
      "bg-[var(--color-error)] text-white hover:opacity-90",
    outlineDanger:
      "border border-[var(--color-error)] bg-white text-[var(--color-error)] hover:bg-[var(--color-error-light)]",
    disabled: "bg-gray-400 text-white cursor-not-allowed",
    back: "bg-gray-500 text-white hover:bg-gray-600",
  };

  const isDisabled = disabled || variant === "disabled";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}