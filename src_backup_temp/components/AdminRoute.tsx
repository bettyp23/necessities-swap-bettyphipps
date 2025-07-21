"use client"

import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to home if not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  // Render child routes if authenticated and admin
  return <Outlet />
}

export default AdminRoute