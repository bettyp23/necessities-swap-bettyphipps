from pymongo import MongoClient
from datetime import datetime
from config import Config

# Initialize MongoDB client
client = MongoClient(Config.MONGODB_URI)
db = client.get_default_database()
items_collection = db.items

def create_item(title, description, category, user_id):
    """Create a new item in the database"""
    item = {
        "title": title,
        "description": description,
        "category": category,
        "user_id": user_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    result = items_collection.insert_one(item)
    return str(result.inserted_id)

def get_item_by_id(item_id):
    """Get an item by ID"""
    from bson import ObjectId
    return items_collection.find_one({"_id": ObjectId(item_id)})

def get_items_by_user(user_id):
    """Get all items posted by a user"""
    return list(items_collection.find({"user_id": user_id}))

def get_available_items():
    """Get all available items"""
    return list(items_collection.find({"status": "approved"}))