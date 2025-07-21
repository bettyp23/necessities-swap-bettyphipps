"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { itemsApi } from "../utils/api"
import ItemCard from "../components/ItemCard"
import { ArrowRight, Package, Recycle, Users } from "lucide-react"

const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const response = await itemsApi.getAll()
        // Get the most recent 4 items
        setFeaturedItems(response.data.slice(0, 4))
      } catch (error) {
        console.error("Error fetching featured items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-emerald-50 rounded-xl p-8 md:p-12 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Swap, Share, Sustain</h1>
          <p className="text-xl text-gray-600 mb-8">
            A community platform for college students to exchange necessities, reduce waste, and build connections.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/items">Browse Items</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/post-item">Post an Item</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Post Items</h3>
            <p className="text-gray-600">
              List items you no longer need but are still in good condition for others to claim.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Connect</h3>
            <p className="text-gray-600">
              Browse items posted by other students and connect with them to arrange exchanges.
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Reduce Waste</h3>
            <p className="text-gray-600">
              Help reduce waste by giving items a second life instead of throwing them away.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Items</h2>
          <Link to="/items" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading featured items...</div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item: any) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No items available yet. Be the first to post!</p>
            <Button className="mt-4" asChild>
              <Link to="/post-item">Post an Item</Link>
            </Button>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white rounded-xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-lg text-gray-300 mb-8">
            Start sharing, swapping, and making a positive impact on campus sustainability.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">Create an Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default HomePage