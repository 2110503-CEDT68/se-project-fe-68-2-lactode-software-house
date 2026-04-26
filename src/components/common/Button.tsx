'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'primary-icon' | 'danger' | 'disabled';

type BaseProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

type ButtonProps =
  | (BaseProps & {
      href: string;
      onClick?: never;
      type?: never;
    })
  | (BaseProps & {
      href?: undefined;
      onClick?: () => void;
      type?: 'button' | 'submit' | 'reset';
    });

export default function Button({
  children,
  icon,
  variant = 'primary',
  disabled = false,
  className = '',
  testId,
  ...props
}: ButtonProps) {
  const resolvedVariant = disabled ? 'disabled' : variant;
  const classes = `btn btn-${resolvedVariant} ${className}`.trim();

  const content = (
    <>
      {icon ? <span className="btn-icon">{icon}</span> : null}
      <span>{children}</span>
    </>
  );

  if ('href' in props && props.href) {
    return (
      <Link
        href={props.href}
        className={classes}
        data-testid={testId}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) e.preventDefault();
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
      data-testid={testId}
    >
      {content}
    </button>
  );
}
