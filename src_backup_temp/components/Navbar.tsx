"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Package, ShieldCheck } from "lucide-react"

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Package className="h-6 w-6 mr-2 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">NecessitiesSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/items" className="text-gray-600 hover:text-emerald-600 transition-colors">
              Browse Items
            </Link>
            {user && (
              <Link to="/post-item" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Post Item
              </Link>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              to="/items"
              className="block text-gray-600 hover:text-emerald-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Items
            </Link>

            {user && (
              <Link
                to="/post-item"
                className="block text-gray-600 hover:text-emerald-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Post Item
              </Link>
            )}

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-gray-600 hover:text-emerald-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-600 hover:text-emerald-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-600 hover:text-emerald-600 transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/login")
                    setIsMenuOpen(false)
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    navigate("/register")
                    setIsMenuOpen(false)
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar