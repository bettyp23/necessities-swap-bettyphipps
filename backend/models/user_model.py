from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash
from config import Config

# Initialize MongoDB client
client = MongoClient(Config.MONGODB_URI)
db = client.get_default_database()
users_collection = db.users

def create_user(email, password, name, role="user"):
    """Create a new user in the database"""
    user = {
        "email": email,
        "password": generate_password_hash(password),
        "name": name,
        "role": role,
        "active": True,
        "created_at": datetime.utcnow()
    }
    result = users_collection.insert_one(user)
    return str(result.inserted_id)

def get_user_by_email(email):
    """Get a user by email"""
    return users_collection.find_one({"email": email})

def get_user_by_id(user_id):
    """Get a user by ID"""
    from bson import ObjectId
    return users_collection.find_one({"_id": ObjectId(user_id)})