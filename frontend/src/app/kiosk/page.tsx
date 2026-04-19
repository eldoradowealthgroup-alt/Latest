"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GovHeader, GovFooter } from '@/components/layout'
import { Building2 } from 'lucide-react'

export default function KioskPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-10 h-10 text-gov-blue" />
            <div>
              <h1 className="text-3xl font-bold text-gov-blue-dark">Federal Bonding Kiosk</h1>
              <p className="text-gov-gray">Use authorized bonding kiosks nationwide</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
            <h2 className="font-bold text-lg mb-3">About Federal Bonding Kiosks</h2>
            <ul className="space-y-2 text-sm">
              <li>• Available at convenient locations nationwide</li>
              <li>• Syncs directly with federal database</li>
              <li>• No personal information required at kiosk</li>
              <li>• Accepts cash deposits for surety bonds</li>
              <li>• Multiple kiosk providers accepted</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <h3 className="font-bold mb-2">Important Instructions</h3>
            <p className="text-sm text-gray-700">
              Before visiting a kiosk, ensure you have your Trust Account ID# (10 digit FBI ACCT #) 
              and your trust account QR-CODE issued by U.S. Dept of Treasury. Follow all instructions 
              provided by your contacting officer.
            </p>
          </div>

          <div className="text-center">
            <Button onClick={() => router.push('/payment')}>
              Return to Payment Methods
            </Button>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
