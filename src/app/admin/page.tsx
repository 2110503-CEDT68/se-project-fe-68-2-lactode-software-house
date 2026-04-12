import Link from 'next/link';
import Button from '@/src/components/common/Button';

const recentBookings = [
  {
    id: 1,
    hotel: 'Lanna Riverside Resort',
    location: 'Bangkok',
    phone: '085-678-9012',
    guest: 'nine',
    email: 'nine_user@gmail.com',
    checkIn: '4/17/2026',
    checkOut: '4/19/2026',
    nights: 2,
  },
  {
    id: 2,
    hotel: 'Lanna Riverside Resort',
    location: 'Bangkok',
    phone: '085-678-9012',
    guest: 'nine',
    email: 'nine_user@gmail.com',
    checkIn: '4/17/2026',
    checkOut: '4/19/2026',
    nights: 2,
  },
  {
    id: 3,
    hotel: 'Lanna Riverside Resort',
    location: 'Bangkok',
    phone: '085-678-9012',
    guest: 'nine',
    email: 'nine_user@gmail.com',
    checkIn: '4/17/2026',
    checkOut: '4/19/2026',
    nights: 2,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-8 py-10">
      <section className="mb-8">
        <p
          className="mb-3 text-[18px] font-bold tracking-[0.24em] uppercase"
          style={{ color: 'var(--color-primary)' }}
        >
          Admin Dashboard
        </p>

        <h1 className="mb-2 text-[56px] leading-none font-bold text-[var(--color-text-primary)]">
          Welcome back, Admin
        </h1>

        <p className="text-[24px] text-[var(--color-text-secondary)]">
          Manage your system and monitor recent activity.
        </p>
      </section>

      <section className="card mb-8 rounded-[32px] px-8 py-7">
        <h2 className="mb-4 text-[24px] font-bold text-[var(--color-text-primary)]">
          Summary
        </h2>

        <ul className="list-disc space-y-2 pl-8 text-[18px] text-[var(--color-text-primary)]">
          <li>Total Bookings: 120</li>
          <li>Total Hotels: 25</li>
          <li>Total Users: 300</li>
        </ul>
      </section>

      <section className="card mb-8 rounded-[32px] px-8 py-7">
        <h2 className="mb-6 text-[24px] font-bold text-[var(--color-text-primary)]">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link href="/admin/hotels">
            <Button className="btn-md" variant="primary">
              Manage Hotel
            </Button>
          </Link>

          <Link href="/admin/bookings">
            <Button className="btn-md" variant="primary">
              View booking
            </Button>
          </Link>
        </div>
      </section>

      <section className="card rounded-[32px] px-7 py-7">
        <h2 className="mb-5 text-[24px] font-bold text-[var(--color-text-primary)]">
          Recent Booking
        </h2>

        <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)]">
          <div
            className="grid items-center px-5 py-4 text-[13px] font-semibold text-[var(--color-text-secondary)]"
            style={{
              gridTemplateColumns: '2.2fr 1.4fr 0.8fr 1fr',
              backgroundColor: 'var(--color-bg-card-2)',
            }}
          >
            <div>Guest / Hotel</div>
            <div>Dates</div>
            <div>Nights</div>
            <div className="text-center">Action</div>
          </div>

          {recentBookings.map((booking, index) => (
            <div
              key={booking.id}
              className="grid items-center px-5 py-5"
              style={{
                gridTemplateColumns: '2.2fr 1.4fr 0.8fr 1fr',
                borderTop:
                  index === 0 ? '1px solid var(--color-border)' : '1px solid var(--color-border)',
              }}
            >
              <div>
                <p className="mb-2 text-[19px] font-medium text-[var(--color-text-primary)]">
                  {booking.hotel}
                </p>
                <p className="text-[14px] text-[var(--color-text-secondary)]">
                  {booking.location} · {booking.phone}
                </p>
                <p className="text-[14px] text-[var(--color-text-secondary)]">
                  {booking.guest} · {booking.email}
                </p>
              </div>

              <div className="text-[14px] text-[var(--color-text-secondary)]">
                <p>{booking.checkIn}</p>
                <p>{booking.checkOut}</p>
              </div>

              <div className="text-[16px] text-[var(--color-text-secondary)]">
                {booking.nights}
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="danger" className="btn-sm">
                  Delete
                </Button>

                <Link href={`/admin/bookings/${booking.id}/edit`}>
                  <Button variant="primary" className="btn-sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}