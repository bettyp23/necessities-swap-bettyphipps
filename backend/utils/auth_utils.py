from flask import session
from models.user_model import users_collection
from bson import ObjectId

def is_admin(session):
    """Check if the current session belongs to an admin user"""
    if 'admin' not in session:
        return False
    
    admin_id = session.get('admin')
    admin = users_collection.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    return admin is not None

def get_current_user_id(session):
    """Get the current user ID from session"""
    return session.get('user_id')

def get_current_user(session):
    """Get the current user from session"""
    user_id = get_current_user_id(session)
    if not user_id:
        return None
    
    return users_collection.find_one({"_id": ObjectId(user_id)})
