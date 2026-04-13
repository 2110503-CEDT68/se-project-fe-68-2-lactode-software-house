'use client'

import Button from '@/src/components/common/Button';
import { LogIn } from 'lucide-react';
import { useApp } from '@/src/context/AppContext';

export default function ExamplePage() {
  const makeUser = (name: string, role: 'user' | 'hotelOwner' | 'admin') => ({
    _id: role === 'hotelOwner' ? '69da0c7ff8190a65bcf5db14' : `${role}-${name.toLowerCase()}`,
    firstname: name,
    lastname: role === 'admin' ? 'Admin' : role === 'hotelOwner' ? 'Owner' : 'User',
    username: `${name} ${role === 'admin' ? 'Admin' : role === 'hotelOwner' ? 'Owner' : 'User'}`.trim(),
    email: `${name.toLowerCase()}@example.com`,
    tel: '012-345-6789',
    role,
  });
  const { setUser, logoutUser } = useApp(); // 👈 เพิ่มตรงนี้

  return (
    <div className="flex flex-col gap-8 p-10">

      {/* 🔥 TEST ROLE */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setUser(makeUser('Jame', 'user'))} className="border px-3 py-1 rounded-full">
          User
        </button>

        <button onClick={() => setUser(makeUser('Owner', 'hotelOwner'))} className="border px-3 py-1 rounded-full">
          Owner
        </button>

        <button onClick={() => setUser(makeUser('Admin', 'admin'))} className="border px-3 py-1 rounded-full">
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
