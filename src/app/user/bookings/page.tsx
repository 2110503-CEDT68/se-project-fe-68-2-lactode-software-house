import BookingCard from "@/components/booking/BookingCard";

export default function BookingPage() {
  return (
    <div className="p-6 space-y-4">
      <BookingCard
        hotelName="Lanna Riverside Resort"
        location="Bangkok"
        contact="085-678-9012"
        email="user@gmail.com"
        checkIn="4/17/2026"
        checkOut="4/19/2026"
        rooms={2}
      />
    </div>
  );
}