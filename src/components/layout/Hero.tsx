import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative flex min-h-[calc(100vh-88px)] items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.48), rgba(15,23,42,0.48)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80')"
        }}
      >
        <div className="px-4 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-100 sm:text-2xl font-bold">
            Discover luxury hotels around the world
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/hotel"
              className="inline-flex items-center gap-3 rounded-2xl bg-brand-500 px-7 py-4 text-lg font-bold text-white shadow-soft transition hover:bg-brand-600"
            >
              <Search className="h-6 w-6" /> Browse Hotels
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
