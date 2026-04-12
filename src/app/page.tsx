'use client'

import Button from '@/src/components/common/Button';
import { LogIn } from 'lucide-react';
import { useApp } from '@/src/context/AppContext';

export default function ExamplePage() {
  const { setUser, logoutUser } = useApp(); // 👈 เพิ่มตรงนี้

  return (
    <div className="flex flex-col gap-8 p-10">

      {/* 🔥 TEST ROLE */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setUser({ name: 'Guest', role: 'guest' })} className="border px-3 py-1 rounded-full">
          Guest
        </button>

        <button onClick={() => setUser({ name: 'Jame', role: 'user' })} className="border px-3 py-1 rounded-full">
          User
        </button>

        <button onClick={() => setUser({ name: 'Owner', role: 'hotel owner' })} className="border px-3 py-1 rounded-full">
          Owner
        </button>

        <button onClick={() => setUser({ name: 'Admin', role: 'admin' })} className="border px-3 py-1 rounded-full">
          Admin
        </button>

        <button onClick={logoutUser} className="border px-3 py-1 rounded-full">
          Logout
        </button>
      </div>

      {/* 🔽 ของเดิมคุณ */}
      <Button>Button</Button>
      <Button className='btn-sm'>Button-sm</Button>
      <Button className='btn-md'>Button-md</Button>
      <Button className='btn-lg'>Button-lg</Button>

      <Button variant="primary-icon" icon={<LogIn size={40} strokeWidth={2} />}>
        Button
      </Button>

      <Button variant="danger">Delete</Button>

      <Button disabled>Back</Button>
    </div>
  );
}