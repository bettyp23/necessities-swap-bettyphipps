from models.user_model import users_collection
from bson import ObjectId

def is_admin(session):
    """Check if the current session belongs to an admin user"""
    if 'admin' not in session:
        return False
    
    admin_id = session.get('admin')
    admin = users_collection.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    return admin is not None
