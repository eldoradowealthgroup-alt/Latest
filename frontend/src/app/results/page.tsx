"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GovHeader, GovFooter } from '@/components/layout'
import { CitationResult } from '@/lib/api'
import { AlertTriangle, FileText } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<CitationResult | null>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const storedResult = localStorage.getItem('searchResult')
    const storedProfile = localStorage.getItem('userProfile')
    
    if (!storedResult) {
      router.push('/search')
      return
    }
    
    setResult(JSON.parse(storedResult))
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile))
    }
  }, [router])

  if (!result) return null

  const totalFines = result.citations?.reduce((sum, c) => {
    const fine = parseFloat(c.fine.replace(/[$,]/g, ''))
    return sum + fine
  }, 0) || 0

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-red" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {result.found ? (
            <>
              <div className="bg-red-50 border-l-4 border-gov-red p-4 mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-gov-red" />
                  <h2 className="text-xl font-bold text-gov-red">Outstanding Citations Found</h2>
                </div>
              </div>

              {profile && (
                <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
                  <h3 className="font-bold text-gov-blue-dark mb-2">Defendant Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gov-gray">Name:</span> {profile.name}</div>
                    <div><span className="text-gov-gray">Address:</span> {profile.address}</div>
                    <div><span className="text-gov-gray">Phone:</span> {profile.phone}</div>
                    <div><span className="text-gov-gray">DOB:</span> {profile.dob}</div>
                  </div>
                </div>
              )}

              <div className="bg-white border border-gray-200 shadow-lg overflow-hidden mb-6">
                <div className="bg-gov-blue-dark text-white p-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Citation Details
                  </h3>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 text-xs font-bold uppercase">Citation ID</th>
                      <th className="text-left p-3 text-xs font-bold uppercase">Offense</th>
                      <th className="text-left p-3 text-xs font-bold uppercase">Date</th>
                      <th className="text-right p-3 text-xs font-bold uppercase">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.citations?.map((citation, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-3 font-mono text-sm">{citation.citation_id}</td>
                        <td className="p-3 text-sm">{citation.offense}</td>
                        <td className="p-3 text-sm">{citation.date}</td>
                        <td className="p-3 text-sm text-right font-mono text-gov-red font-bold">
                          {citation.fine}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-gray-400 bg-gray-50">
                      <td colSpan={3} className="p-3 text-right font-bold">Total Outstanding:</td>
                      <td className="p-3 text-right font-mono text-gov-red font-bold text-lg">
                        ${totalFines.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={() => router.push('/courses-of-action')}
                >
                  VIEW COURSES OF ACTION
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push('/payment')}
                >
                  PROCEED TO PAYMENT
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gov-green mb-4">No Citations Found</h2>
              <p className="text-gov-gray mb-6">
                No outstanding citations were found matching your search criteria.
              </p>
              <Button onClick={() => router.push('/search')}>
                NEW SEARCH
              </Button>
            </div>
          )}
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
