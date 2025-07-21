"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { itemsApi, usersApi } from "../utils/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import ItemCard from "../components/ItemCard"
import { Package, Settings, AlertCircle } from "lucide-react"

const ProfilePage = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [myItems, setMyItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const response = await itemsApi.getMyItems()
        setMyItems(response.data)
      } catch (error) {
        console.error("Error fetching my items:", error)
        toast({
          title: "Error",
          description: "Could not load your items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMyItems()
  }, [toast])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
    setError(null) // Clear error when user types
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!profileData.name || !profileData.email) {
      setError("Name and email are required")
      return
    }

    // If changing password, validate password fields
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        setError("Current password is required to set a new password")
        return
      }

      if (profileData.newPassword !== profileData.confirmPassword) {
        setError("New passwords do not match")
        return
      }

      if (profileData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long")
        return
      }
    }

    setUpdating(true)
    setError(null)

    try {
      const updateData: any = {
        name: profileData.name,
        email: profileData.email,
      }

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword
        updateData.currentPassword = profileData.currentPassword
      }

      await usersApi.updateProfile(updateData)
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })

      // Clear password fields
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not update profile. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="items" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            My Items
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <h2 className="text-xl font-semibold mb-4">My Posted Items</h2>

          {loading ? (
            <div className="text-center py-12">Loading your items...</div>
          ) : myItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myItems.map((item: any) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">You haven't posted any items yet.</p>
              <Button asChild>
                <a href="/post-item">Post Your First Item</a>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile information and password</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-gray-500">
                    Leave these fields blank if you don't want to change your password
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProfilePage
