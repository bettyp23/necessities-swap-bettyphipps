"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { itemsApi } from "../utils/api"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, User, Tag, AlertCircle } from "lucide-react"

const ItemDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return

      try {
        const response = await itemsApi.getById(id)
        setItem(response.data)
      } catch (error) {
        console.error("Error fetching item details:", error)
        toast({
          title: "Error",
          description: "Could not load item details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id, toast])

  const handleClaimItem = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (!id) return

    setClaiming(true)
    try {
      await itemsApi.claim(id)
      toast({
        title: "Success!",
        description: "You've successfully claimed this item.",
      })
      // Update the item status locally
      setItem({ ...item, status: "claimed", claimed_by: user.user_id })
    } catch (error) {
      console.error("Error claiming item:", error)
      toast({
        title: "Error",
        description: "Could not claim this item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setClaiming(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading item details...</div>
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-gray-600 mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/items")}>Browse Other Items</Button>
      </div>
    )
  }

  const isOwner = user && user.user_id === item.user_id
  const isClaimed = item.status === "claimed"
  const isClaimedByCurrentUser = isClaimed && user && item.claimed_by === user.user_id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Item Image */}
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <img
            src={item.image_url || `/placeholder.svg?height=500&width=500&query=item ${item.category}`}
            alt={item.title}
            className="w-full h-full object-cover aspect-square"
          />
        </div>

        {/* Item Details */}
        <div>
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{item.title}</h1>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {item.category}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Posted {formatDate(item.created_at)}</span>
            </div>

            <div className="prose max-w-none">
              <p>{item.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8">
            {isOwner ? (
              <Card>
                <CardContent className="p-4">
                  <p className="text-amber-600 font-medium mb-2">This is your item</p>
                  <p className="text-gray-600 text-sm">
                    You posted this item. You can view all your posted items in your profile.
                  </p>
                </CardContent>
              </Card>
            ) : isClaimed ? (
              <Card>
                <CardContent className="p-4">
                  {isClaimedByCurrentUser ? (
                    <>
                      <p className="text-emerald-600 font-medium mb-2">You've claimed this item!</p>
                      <p className="text-gray-600 text-sm">Contact the owner to arrange pickup or delivery.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 font-medium mb-2">This item has been claimed</p>
                      <p className="text-gray-600 text-sm">This item is no longer available.</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Button size="lg" className="w-full" onClick={handleClaimItem} disabled={claiming}>
                {claiming ? "Processing..." : "Claim This Item"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{item.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Posted By</p>
                  <p className="font-medium">{item.user_name || "Anonymous User"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ItemDetailPage