"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Package, AlertCircle } from "lucide-react"

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await login(formData.email, formData.password)
      toast({
        title: "Login successful",
        description: "Welcome back to NecessitiesSwap!",
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center">
          <Package className="h-8 w-8 mr-2 text-emerald-600" />
          <span className="text-2xl font-bold text-gray-900">NecessitiesSwap</span>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account to post and claim items</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Demo Credentials */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-700 mb-2">Demo Credentials</h3>
        <p className="text-gray-600 text-sm mb-2">Use these credentials to try out the application:</p>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Email:</strong> demo@example.com
          </p>
          <p>
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage