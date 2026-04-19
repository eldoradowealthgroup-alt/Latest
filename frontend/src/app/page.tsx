"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GovHeader, GovFooter } from '@/components/layout'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await api.login(email, password)
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user))
      
      if (user.is_admin) {
        router.push('/admin')
      } else {
        router.push('/profile')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <GovHeader />
      <div className="border-b-4 border-gov-red" />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gov-blue-dark mb-2">
              Sign In To Your Account
            </h2>
            <p className="text-gov-gray mb-6">
              Access the Electronic Docket Registry
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
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  data-testid="login-email-input"
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
                  placeholder="Enter your password"
                  required
                  data-testid="login-password-input"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="login-submit-button"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gov-gray mb-2">Don't have an account?</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/register')}
                data-testid="create-account-link"
              >
                CREATE NEW ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </main>

      <GovFooter />
    </div>
  )
}
