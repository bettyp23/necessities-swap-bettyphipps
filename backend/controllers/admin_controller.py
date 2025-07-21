from flask import Blueprint, request, jsonify, session
from bson import ObjectId
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
from models.user_model import users_collection
from models.item_model import items_collection
from utils.auth_utils import is_admin

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    user = users_collection.find_one({"email": data.get("email"), "role": "admin"})
    if user and check_password_hash(user['password'], data.get("password")):
        session['admin'] = str(user['_id'])
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

@admin_bp.route("/users", methods=["GET"])
def get_users():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    users = list(users_collection.find({}, {"password": 0}))
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@admin_bp.route("/users/<user_id>", methods=["PATCH"])
def update_user(user_id):
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    updates = request.get_json()
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    return jsonify({"message": "User updated"})

@admin_bp.route("/items", methods=["GET"])
def get_items():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    items = list(items_collection.find({}))
    for item in items:
        item['_id'] = str(item['_id'])
    return jsonify(items)

@admin_bp.route("/items/<item_id>/moderate", methods=["POST"])
def moderate_item(item_id):
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    action = request.get_json().get("action")  # 'approved' or 'rejected'
    items_collection.update_one({"_id": ObjectId(item_id)}, {"$set": {"status": action}})
    return jsonify({"message": f"Item {action}d"})

@admin_bp.route("/items", methods=["POST"])
def add_item():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    items_collection.insert_one(data)
    return jsonify({"message": "Item added"})

@admin_bp.route("/analytics/users", methods=["GET"])
def get_user_stats():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    total_users = users_collection.count_documents({})
    active_users = users_collection.count_documents({"active": True})
    inactive_users = total_users - active_users
    now = datetime.utcnow()
    new_users = {
        "7_days": users_collection.count_documents({"created_at": {"$gte": now - timedelta(days=7)}}),
        "30_days": users_collection.count_documents({"created_at": {"$gte": now - timedelta(days=30)}}),
        "90_days": users_collection.count_documents({"created_at": {"$gte": now - timedelta(days=90)}}),
    }
    return jsonify({
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "new_users": new_users
    })

@admin_bp.route("/analytics/activity", methods=["GET"])
def get_activity_overview():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    total_posts = items_collection.count_documents({})
    category_counts = list(items_collection.aggregate([
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]))
    claimed_count = items_collection.count_documents({"status": "claimed"})
    completion_rate = (claimed_count / total_posts * 100) if total_posts > 0 else 0
    return jsonify({
        "total_posts": total_posts,
        "category_counts": category_counts,
        "completion_rate": completion_rate
    })