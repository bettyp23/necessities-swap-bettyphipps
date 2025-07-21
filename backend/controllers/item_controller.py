from flask import Blueprint, request, jsonify, session
from bson import ObjectId
from models.item_model import items_collection
from utils.auth_utils import get_current_user_id

item_bp = Blueprint('items', __name__)

@item_bp.route("/", methods=["GET"])
def get_items():
    """Get all available items"""
    query = {"status": "approved"}
    
    # Filter by category if provided
    category = request.args.get('category')
    if category:
        query["category"] = category
    
    items = list(items_collection.find(query))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify(items)

@item_bp.route("/<item_id>", methods=["GET"])
def get_item(item_id):
    """Get a specific item by ID"""
    try:
        item = items_collection.find_one({"_id": ObjectId(item_id)})
        if not item:
            return jsonify({"error": "Item not found"}), 404
        
        item['_id'] = str(item['_id'])
        return jsonify(item)
    except:
        return jsonify({"error": "Invalid item ID"}), 400

@item_bp.route("/", methods=["POST"])
def create_item():
    """Create a new item"""
    user_id = get_current_user_id(session)
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    data = request.get_json()
    required_fields = ['title', 'description', 'category']
    
    # Validate required fields
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # Create new item
    new_item = {
        "title": data['title'],
        "description": data['description'],
        "category": data['category'],
        "user_id": user_id,
        "status": "pending",  # Items need admin approval
        "created_at": datetime.utcnow()
    }
    
    # Add optional fields
    if 'image_url' in data:
        new_item['image_url'] = data['image_url']
    
    result = items_collection.insert_one(new_item)
    return jsonify({
        "message": "Item created successfully",
        "item_id": str(result.inserted_id)
    }), 201

@item_bp.route("/<item_id>/claim", methods=["POST"])
def claim_item(item_id):
    """Claim an item"""
    user_id = get_current_user_id(session)
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    try:
        # Check if item exists and is available
        item = items_collection.find_one({
            "_id": ObjectId(item_id),
            "status": "approved"
        })
        
        if not item:
            return jsonify({"error": "Item not found or not available"}), 404
        
        # Update item status
        items_collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": {
                "status": "claimed",
                "claimed_by": user_id,
                "claimed_at": datetime.utcnow()
            }}
        )
        
        return jsonify({"message": "Item claimed successfully"})
    except:
        return jsonify({"error": "Invalid item ID"}), 400

@item_bp.route("/my-items", methods=["GET"])
def get_my_items():
    """Get items posted by the current user"""
    user_id = get_current_user_id(session)
    if not user_id:
        return jsonify({"error": "Authentication required"}), 401
    
    items = list(items_collection.find({"user_id": user_id}))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify(items)