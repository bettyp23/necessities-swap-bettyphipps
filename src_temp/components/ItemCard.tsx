import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface ItemCardProps {
  item: {
    _id: string
    title: string
    description: string
    category: string
    image_url?: string
    created_at: string
    status: string
  }
}

const ItemCard = ({ item }: ItemCardProps) => {
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <Link to={`/items/${item._id}`} className="flex-grow flex flex-col">
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={item.image_url || `/placeholder.svg?height=300&width=300&query=item ${item.category}`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {item.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <p className="text-gray-600 text-sm line-clamp-3">{truncateDescription(item.description)}</p>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Posted {formatDate(item.created_at)}</span>
        </CardFooter>
      </Link>
    </Card>
  )
}

export default ItemCard