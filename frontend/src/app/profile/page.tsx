"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GovHeader, GovFooter } from '@/components/layout'
import { api, User } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [ssn, setSsn] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/')
      return
    }
    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)
    setEmail(parsedUser.email)
  }, [router])

  const formatSSN = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`
  }

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSsn(formatSSN(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError('')
    setLoading(true)

    try {
      await api.updateProfile(user.id, {
        name,
        address,
        dob,
        phone,
        email,
        ssn,
      })
      
      localStorage.setItem('userProfile', JSON.stringify({ name, address, dob, phone, email, ssn }))
      router.push('/search')
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-green" />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gov-blue-dark mb-2">
              Complete Your Profile
            </h2>
            <p className="text-gov-gray mb-6">
              Please provide your information for identity verification
            </p>

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
                  data-testid="profile-name-input"
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-xs font-bold uppercase text-gray-700">
                  Street Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address"
                  required
                  data-testid="profile-address-input"
                />
              </div>

              <div>
                <Label htmlFor="dob" className="text-xs font-bold uppercase text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  data-testid="profile-dob-input"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-xs font-bold uppercase text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  data-testid="profile-phone-input"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-xs font-bold uppercase text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  data-testid="profile-email-input"
                />
              </div>

              <div>
                <Label htmlFor="ssn" className="text-xs font-bold uppercase text-gray-700">
                  Social Security Number
                </Label>
                <Input
                  id="ssn"
                  type="text"
                  value={ssn}
                  onChange={handleSSNChange}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  required
                  className="font-mono"
                  data-testid="profile-ssn-input"
                />
                <p className="text-xs text-gov-gray mt-1">Required for identity verification</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="success"
                disabled={loading}
                data-testid="profile-save-button"
              >
                {loading ? 'SAVING...' : 'SAVE AND CONTINUE'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
