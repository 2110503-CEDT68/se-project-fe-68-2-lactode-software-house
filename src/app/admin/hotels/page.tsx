import { Suspense } from 'react'
import AdminHotelPageClient from '../../../components/hotel/AdminHotelPageClient'

function HotelPageFallback() {
  return <div>Loading...</div>
}

export default function HotelPage() {
  return (
    <Suspense fallback={<HotelPageFallback />}>
      <AdminHotelPageClient />
    </Suspense>
  )
}
