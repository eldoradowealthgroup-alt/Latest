"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GovHeader, GovFooter } from '@/components/layout'
import { CreditCard, Building2, LogOut } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gov-blue-dark mb-2">Payment Methods</h1>
          <p className="text-gov-gray mb-8">Select your preferred payment method</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Credit/Debit Card */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gov-green text-white p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Debit/Credit Cards
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gov-gray text-sm mb-4">
                  Pay securely using your debit or credit card. 
                  All major cards accepted.
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  <li>• Visa, Mastercard, American Express</li>
                  <li>• Secure encrypted transaction</li>
                  <li>• Instant confirmation</li>
                </ul>
                <Button variant="success" className="w-full">
                  PAY HERE
                </Button>
              </div>
            </div>

            {/* Federal Kiosk */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gov-blue text-white p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Federal Bonding Kiosk
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gov-gray text-sm mb-4">
                  Use authorized bonding kiosks at convenient locations nationwide.
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  <li>• Available at multiple locations</li>
                  <li>• Cash deposits accepted</li>
                  <li>• Multiple kiosk providers accepted</li>
                </ul>
                <Button className="w-full" onClick={() => router.push('/kiosk')}>
                  KIOSK INFORMATION
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button variant="ghost" onClick={() => router.push('/courses-of-action')}>
              ← Back to Courses of Action
            </Button>
            <Button 
              variant="outline" 
              className="text-gov-red border-gov-red hover:bg-gov-red hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
