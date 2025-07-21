"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { adminApi } from "../../utils/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Users, Package, TrendingUp, AlertCircle } from "lucide-react"

const AdminDashboard = () => {
  const { toast } = useToast()
  const [userStats, setUserStats] = useState<any>(null)
  const [activityStats, setActivityStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [userStatsResponse, activityResponse] = await Promise.all([
          adminApi.getUserStats(),
          adminApi.getActivityOverview(),
        ])

        setUserStats(userStatsResponse.data)
        setActivityStats(activityResponse.data)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Could not load dashboard data. Please try again.")
        toast({
          title: "Error",
          description: "Could not load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return <div className="text-center py-12">Loading dashboard data...</div>
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/admin/users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/items">
              <Package className="h-4 w-4 mr-2" />
              Manage Items
            </Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.total_users || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.active_users || 0}</div>
            <p className="text-sm text-gray-500">
              {userStats?.total_users ? Math.round((userStats.active_users / userStats.total_users) * 100) : 0}% of
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activityStats?.total_posts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(activityStats?.completion_rate || 0)}%</div>
            <p className="text-sm text-gray-500">Items claimed vs. posted</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            User Statistics
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Activity Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>New User Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last 7 days</span>
                    <span className="font-semibold">{userStats?.new_users?.["7_days"] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last 30 days</span>
                    <span className="font-semibold">{userStats?.new_users?.["30_days"] || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last 90 days</span>
                    <span className="font-semibold">{userStats?.new_users?.["90_days"] || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-semibold">{userStats?.active_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inactive Users</span>
                    <span className="font-semibold">{userStats?.inactive_users || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">{userStats?.total_users || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {activityStats?.category_counts?.length > 0 ? (
                  <div className="space-y-4">
                    {activityStats.category_counts.map((category: any) => (
                      <div key={category._id} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">{category._id || "Uncategorized"}</span>
                        <span className="font-semibold">{category.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No categories data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Item Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="font-semibold">{activityStats?.total_posts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Claimed Items</span>
                    <span className="font-semibold">
                      {Math.round(((activityStats?.completion_rate || 0) * activityStats?.total_posts) / 100) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{Math.round(activityStats?.completion_rate || 0)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard