import { Suspense } from 'react'
import HotelPageClient from '../../../components/hotel/HotelPageClient'

function HotelPageFallback() {
  return <div>Loading...</div>
}

export default function HotelPage() {
  return (
    <Suspense fallback={<HotelPageFallback />}>
      <HotelPageClient />
    </Suspense>
  )
}