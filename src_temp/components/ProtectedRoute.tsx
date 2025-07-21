"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Render child routes if authenticated
  return <Outlet />
}

export default ProtectedRoute
