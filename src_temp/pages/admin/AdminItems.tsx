"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { adminApi } from "../../utils/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const AdminItems = () => {
  const { toast } = useToast()
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [processingItem, setProcessingItem] = useState<string | null>(null)

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const response = await adminApi.getItems()
        setItems(response.data)
        setFilteredItems(response.data)
      } catch (error) {
        console.error("Error fetching items:", error)
        toast({
          title: "Error",
          description: "Could not load items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [toast])

  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(items)
    }
  }, [searchTerm, items])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect above
  }

  const handleModerateItem = async (itemId: string, action: "approved" | "rejected") => {
    setProcessingItem(itemId)
    try {
      await adminApi.moderateItem(itemId, action)

      // Update the item in the local state
      const updatedItems = items.map((item: any) => (item._id === itemId ? { ...item, status: action } : item))

      setItems(updatedItems)
      setFilteredItems(filteredItems.map((item: any) => (item._id === itemId ? { ...item, status: action } : item)))

      toast({
        title: "Item Updated",
        description: `Item has been ${action}.`,
      })
    } catch (error) {
      console.error("Error moderating item:", error)
      toast({
        title: "Error",
        description: "Could not update item status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingItem(null)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "claimed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Claimed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Items</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search items by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : filteredItems.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posted Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="text-right">
                    {item.status === "pending" && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                          onClick={() => handleModerateItem(item._id, "approved")}
                          disabled={processingItem === item._id}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50 bg-transparent"
                          onClick={() => handleModerateItem(item._id, "rejected")}
                          disabled={processingItem === item._id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                    {(item.status === "approved" || item.status === "rejected") && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/items/${item._id}`, "_blank")}>
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No items found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default AdminItems