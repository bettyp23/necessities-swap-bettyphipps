from pymongo import MongoClient
from datetime import datetime
import os

# This would normally come from your config
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/your_database')

client = MongoClient(MONGODB_URI)
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