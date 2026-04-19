"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GovHeader, GovFooter } from '@/components/layout'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const user = await api.register(email, password)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-blue" />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gov-blue-dark mb-2">
              Create New Account
            </h2>
            <p className="text-gov-gray mb-6">
              Register for the Electronic Docket Registry
            </p>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  data-testid="account-email-input"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-xs font-bold uppercase text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  data-testid="account-password-input"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="account-submit-button"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gov-gray mb-2">Already have an account?</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
