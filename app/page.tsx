import type { Metadata } from 'next'
import ComingSoon from './ComingSoonClient'

// Server-only metadata
export const metadata: Metadata = {
  title: 'Leezign',
  description: 'Easily Sign Lease/Rent Without Hassling A Lawyer',
}

export default function Page() {
  return <ComingSoon />
}
