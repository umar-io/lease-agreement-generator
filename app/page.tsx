import type { Metadata } from 'next'
import LandingPage from './components/LandingPage'

// Server-only metadata
export const metadata: Metadata = {
  title: 'Leezign | Sign Leases Seamlessly',
  description: 'Easily create, sign, and manage lease agreements without a lawyer. Super sleek and animated design.',
}

export default function Page() {
  return <LandingPage />
}
