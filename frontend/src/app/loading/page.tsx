"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GovHeader, GovFooter } from '@/components/layout'

export default function LoadingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          router.push('/results')
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gov-blue-dark mb-4">
              Searching Federal Database
            </h2>
            <p className="text-gov-gray mb-6">
              Please wait while we search the citation records...
            </p>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div
                className="bg-gov-blue h-4 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gov-gray font-mono">{progress}% Complete</p>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
