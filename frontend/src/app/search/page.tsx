"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GovHeader, GovFooter } from '@/components/layout'
import { api } from '@/lib/api'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [citationNumber, setCitationNumber] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/')
      return
    }
    
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      const parsed = JSON.parse(profile)
      setName(parsed.name || '')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.searchCitations(name, citationNumber, zipCode)
      localStorage.setItem('searchResult', JSON.stringify(result))
      localStorage.setItem('searchData', JSON.stringify({ name, citationNumber, zipCode }))
      router.push('/loading')
    } catch (err: any) {
      setError(err.message || 'Search failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-8 h-8 text-gov-blue" />
              <div>
                <h2 className="text-2xl font-bold text-gov-blue-dark">
                  Citation Search
                </h2>
                <p className="text-gov-gray">
                  Search the federal citation database
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-700">
                  Full Legal Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full legal name"
                  required
                  data-testid="search-name-input"
                />
              </div>

              <div>
                <Label htmlFor="citation" className="text-xs font-bold uppercase text-gray-700">
                  Citation Number
                </Label>
                <Input
                  id="citation"
                  type="text"
                  value={citationNumber}
                  onChange={(e) => setCitationNumber(e.target.value)}
                  placeholder="Enter citation number"
                  required
                  className="font-mono"
                  data-testid="search-citation-input"
                />
              </div>

              <div>
                <Label htmlFor="zip" className="text-xs font-bold uppercase text-gray-700">
                  Zip Code
                </Label>
                <Input
                  id="zip"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter zip code"
                  required
                  maxLength={10}
                  data-testid="search-zip-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="search-submit-button"
              >
                {loading ? 'SEARCHING...' : 'SEARCH CITATIONS'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
