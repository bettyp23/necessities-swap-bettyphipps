from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash
import os

# This would normally come from your config
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/your_database')

client = MongoClient(MONGODB_URI)
db = client.get_default_database()
users_collection = db.users

def create_user(email, password, role="user"):
    """Create a new user in the database"""
    user = {
        "email": email,
        "password": generate_password_hash(password),
        "role": role,
        "active": True,
        "created_at": datetime.utcnow()
    }
    result = users_collection.insert_one(user)
    return str(result.inserted_id)

def get_user_by_email(email):
    """Get a user by email"""
    return users_collection.find_one({"email": email})
