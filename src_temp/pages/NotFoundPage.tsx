import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Go to Homepage</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/items">Browse Items</Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
