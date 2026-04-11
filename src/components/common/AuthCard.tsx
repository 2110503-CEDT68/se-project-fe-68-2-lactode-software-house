import { ReactNode } from 'react';

export default function AuthCard({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
