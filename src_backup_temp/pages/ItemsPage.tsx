"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { itemsApi } from "../utils/api"
import ItemCard from "../components/ItemCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

const categories = [
  "All",
  "Furniture",
  "Electronics",
  "Books",
  "Clothing",
  "Kitchen",
  "Decor",
  "School Supplies",
  "Other",
]

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All")

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      try {
        const category = selectedCategory !== "All" ? selectedCategory.toLowerCase() : undefined
        const response = await itemsApi.getAll(category)
        setItems(response.data)
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [selectedCategory])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "All") {
      searchParams.delete("category")
    } else {
      searchParams.set("category", category.toLowerCase())
    }
    setSearchParams(searchParams)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter items client-side for simplicity
    // In a real app, you might want to implement server-side search
  }

  const filteredItems = items.filter(
    (item: any) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      {/* Search and Filter */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer ${
                selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : "hover:bg-emerald-50"
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item: any) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No items found matching your criteria.</p>
          {(searchTerm || selectedCategory !== "All") && (
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchTerm("")
                handleCategoryChange("All")
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default ItemsPage