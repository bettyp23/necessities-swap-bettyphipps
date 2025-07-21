from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_model import users_collection
from datetime import datetime

user_bp = Blueprint('users', __name__)

@user_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['email', 'password', 'name']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Check if user already exists
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    new_user = {
        "email": data['email'],
        "password": generate_password_hash(data['password']),
        "name": data['name'],
        "role": "user",  # Default role
        "active": True,
        "created_at": datetime.utcnow()
    }
    
    result = users_collection.insert_one(new_user)
    
    # Set session
    session['user_id'] = str(result.inserted_id)
    
    return jsonify({
        "message": "Registration successful",
        "user_id": str(result.inserted_id)
    }), 201

@user_bp.route("/login", methods=["POST"])
def login():
    """Login a user"""
    data = request.get_json()
    
    # Check if required fields are present
    if 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email and password required"}), 400
    
    # Find user
    user = users_collection.find_one({"email": data['email']})
    
    # Check if user exists and password is correct
    if user and check_password_hash(user['password'], data['password']):
        session['user_id'] = str(user['_id'])
        
        # Return user info (excluding password)
        user_info = {
            "user_id": str(user['_id']),
            "email": user['email'],
            "name": user['name'],
            "role": user['role']
        }
        
        return jsonify({
            "message": "Login successful",
            "user": user_info
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

@user_bp.route("/logout", methods=["POST"])
def logout():
    """Logout a user"""
    session.pop('user_id', None)
    return jsonify({"message": "Logout successful"})

@user_bp.route("/profile", methods=["GET"])
def get_profile():
    """Get current user profile"""
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    user = users_collection.find_one({"_id": ObjectId(session['user_id'])})
    
    if not user:
        session.pop('user_id', None)
        return jsonify({"error": "User not found"}), 404
    
    # Return user info (excluding password)
    user_info = {
        "user_id": str(user['_id']),
        "email": user['email'],
        "name": user['name'],
        "role": user['role'],
        "created_at": user['created_at']
    }
    
    return jsonify(user_info)

@user_bp.route("/profile", methods=["PUT"])
def update_profile():
    """Update current user profile"""
    if 'user_id' not in session:
        return jsonify({"error": "Not authenticated"}), 401
    
    data = request.get_json()
    updates = {}
    
    # Fields that can be updated
    allowed_fields = ['name', 'email']
    
    for field in allowed_fields:
        if field in data:
            updates[field] = data[field]
    
    # Update password if provided
    if 'password' in data:
        updates['password'] = generate_password_hash(data['password'])
    
    if updates:
        users_collection.update_one(
            {"_id": ObjectId(session['user_id'])},
            {"$set": updates}
        )
    
    return jsonify({"message": "Profile updated successfully"})