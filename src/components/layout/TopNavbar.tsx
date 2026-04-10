import Link from "next/link";

type Role = "guest" | "user" | "hotelOwner" | "admin";

type TopNavbarProps = {
  role?: Role;
  username?: string;
};

export default function TopNavbar({
  role = "guest",
  username = "User",
}: TopNavbarProps) {
  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[var(--color-primary)]" />
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-[0.35em] text-[var(--color-text-primary)]">
              LACTODE
            </p>
            <p className="text-sm font-bold tracking-[0.35em] text-[var(--color-text-primary)]">
              SOFTWARE HOUSE
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-5 text-sm text-[var(--color-text-secondary)]">
          {role === "guest" && (
            <>
              <Link href="/hotels">Hotel</Link>
              <Link href="/login">Login</Link>
            </>
          )}

          {role === "user" && (
            <>
              <Link href="/hotels">Hotel</Link>
              <Link href="/bookings">My Bookings</Link>
              <Link href="/account">{username}</Link>
              <Link href="/logout">Logout</Link>
            </>
          )}

          {role === "hotelOwner" && (
            <>
              <Link href="/hotelOwner/hotels">Hotel Management</Link>
              <Link href="/hotelOwner/bookings">Bookings</Link>
              <Link href="/hotelOwner/account">Hotel</Link>
              <Link href="/logout">Logout</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link href="/admin">Admin dashboard</Link>
              <Link href="/admin/hotels">Hotel</Link>
              <Link href="/admin/account">Admin</Link>
              <Link href="/logout">Logout</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}