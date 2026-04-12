// components/AvailabilitySearch.tsx

"use client";

import { User } from "lucide-react";
import { useState } from "react";
import Button from "./Button";

// ── Types ────────────────────────────────────────────────────────────────────

export interface AvailabilitySearchValues {
  checkIn: string;
  checkOut: string;
  guests: number;
}

interface AvailabilitySearchProps {
  onSearch?: (values: AvailabilitySearchValues) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AvailabilitySearch({ onSearch }: AvailabilitySearchProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = () => {
    onSearch?.({ checkIn, checkOut, guests: Number(guests) });
  };

  return (
    <div className="flex items-center gap-2">

      {/* Search bar */}
      <div className="flex flex-1 items-center gap-3 border border-gray-300 rounded-full px-5 py-2.5 bg-white">

        {/* Check-in / Check-out */}
        <div className="flex items-center gap-2 flex-1">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm text-gray-500 bg-transparent outline-none cursor-pointer"
          />
          <span className="text-gray-400 text-sm">-</span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-sm text-gray-500 bg-transparent outline-none cursor-pointer"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-300" />

        {/* Guest count */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400 flex-shrink-0"/>
          <input
            type="number"
            min={0}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-16 text-sm text-gray-500 bg-transparent outline-none"
            placeholder="0"
          />
          <span className="text-sm text-gray-400">people</span>
        </div>

      </div>

      {/* Search button */}
      <Button className="btn-md" onClick={handleSearch}>Search</Button>
    </div>
  );
}