"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GovHeader, GovFooter } from '@/components/layout'
import { AlertTriangle, CreditCard } from 'lucide-react'

export default function CoursesOfActionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gov-blue-dark mb-2">Courses of Action</h1>
          <p className="text-gov-gray mb-8">Select the appropriate course of action for your situation</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Criminal Course */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gov-red text-white p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Criminal Course of Action
                </h3>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2">Self-Surrender to Law Enforcement</h4>
                <p className="text-gov-gray text-sm mb-4">
                  If you have an active warrant, you may choose to voluntarily surrender 
                  to the appropriate law enforcement agency.
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  <li>• Contact your local law enforcement</li>
                  <li>• Bring valid identification</li>
                  <li>• Prepare for possible detention</li>
                </ul>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    if (confirm('Are you sure you want to proceed with self-surrender?')) {
                      alert('Please contact your local law enforcement agency to arrange surrender.')
                    }
                  }}
                >
                  INITIATE SELF-SURRENDER
                </Button>
              </div>
            </div>

            {/* Civil Course */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gov-blue text-white p-4">
                <h3 className="font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Civil Course of Action
                </h3>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-lg mb-2">Surety Bond Payment Procedure</h4>
                <p className="text-gov-gray text-sm mb-4">
                  Pay your outstanding fines through our secure payment system 
                  to resolve your citations.
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  <li>• Pay via debit/credit card</li>
                  <li>• Use Federal Bonding Kiosk</li>
                  <li>• Receive confirmation receipt</li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => router.push('/payment')}
                >
                  VIEW PAYMENT OPTIONS
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={() => router.push('/results')}>
              ← Back to Results
            </Button>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
