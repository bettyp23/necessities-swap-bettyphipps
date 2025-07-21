"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { itemsApi } from "../utils/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, ImagePlus } from "lucide-react"

const categories = ["Furniture", "Electronics", "Books", "Clothing", "Kitchen", "Decor", "School Supplies", "Other"]

const PostItemPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this to a server/cloud storage
    // For now, we'll just create a local URL for preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // In a real app, you would set the image_url to the uploaded image URL
    // For this demo, we'll just use a placeholder
    setFormData((prev) => ({
      ...prev,
      image_url: `/placeholder.svg?height=500&width=500&query=${file.name}`,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await itemsApi.create(formData)
      toast({
        title: "Success!",
        description: "Your item has been posted and is pending approval.",
      })
      navigate(`/items/${response.data.item_id}`)
    } catch (error) {
      console.error("Error posting item:", error)
      toast({
        title: "Error",
        description: "Could not post your item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Post an Item</h1>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="What are you giving away?"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the item, its condition, and any other relevant details"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="mb-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">
                    <ImagePlus className="h-12 w-12 mx-auto mb-2" />
                    <p>Upload an image of your item</p>
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? "Change Image" : "Upload Image"}
                </Button>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
              <p className="text-xs text-gray-500">
                Adding a clear image helps others understand what you're offering.
              </p>
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/items")}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Posting..." : "Post Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-medium text-amber-800 mb-2">Important Note</h3>
        <p className="text-amber-700 text-sm">
          All posted items will be reviewed by our moderators before being listed publicly. This helps ensure the
          quality and appropriateness of items on our platform.
        </p>
      </div>
    </div>
  )
}

export default PostItemPage