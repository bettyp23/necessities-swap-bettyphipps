import { Link } from "react-router-dom"
import { Package, Github, Twitter, Instagram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Package className="h-6 w-6 mr-2 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">NecessitiesSwap</span>
            </Link>
            <p className="mt-4 text-gray-600">
              A platform for college students to exchange necessities and reduce waste.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/post-item" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Post Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/items?category=furniture" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/items?category=electronics"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/items?category=books" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/items?category=clothing" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/items?category=kitchen" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Kitchen
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-gray-600">Contact us: support@necessitiesswap.com</p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} NecessitiesSwap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer