from flask import Flask, request, jsonify, session
from flask_cors import CORS  # Add CORS support
from pymongo import MongoClient
from bson import ObjectId
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta

# Import your models and utils (these files need to exist)
# from models.user_model import users_collection
# from models.item_model import items_collection
# from utils.auth_utils import is_admin
# from config import Config

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# For demonstration, we'll set a secret key directly
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
app.config['MONGODB_URI'] = 'mongodb://localhost:27017/your_database'

# Initialize MongoDB client
client = MongoClient(app.config['MONGODB_URI'])
db = client.get_default_database()
users_collection = db.users
items_collection = db.items

# Helper function since we don't have the imported one
def is_admin(session):
    if 'admin' not in session:
        return False
    admin_id = session.get('admin')
    admin = users_collection.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    return admin is not None

# Root route to check if API is working
@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "API is running"}), 200

# ADMIN AUTH
@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    user = users_collection.find_one({"email": data.get("email"), "role": "admin"})
    if user and check_password_hash(user['password'], data.get("password")):
        session['admin'] = str(user['_id'])
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

# USER MANAGEMENT
@app.route("/api/admin/users", methods=["GET"])
def get_users():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    users = list(users_collection.find({}, {"password": 0}))
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@app.route("/api/admin/users/<user_id>", methods=["PATCH"])
def update_user(user_id):
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    updates = request.get_json()
    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
    return jsonify({"message": "User updated"})

# ITEM MANAGEMENT
@app.route("/api/admin/items", methods=["GET"])
def get_items():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    items = list(items_collection.find({}))
    for item in items:
        item['_id'] = str(item['_id'])
    return jsonify(items)

@app.route("/api/admin/items/<item_id>/moderate", methods=["POST"])
def moderate_item(item_id):
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    action = request.get_json().get("action")  # 'approved' or 'rejected'
    items_collection.update_one({"_id": ObjectId(item_id)}, {"$set": {"status": action}})
    return jsonify({"message": f"Item {action}d"})

@app.route("/api/admin/items", methods=["POST"])
def add_item():
    if not is_admin(session):
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    items_collection.insert_one(data)
    return jsonify({"message": "Item added"})

# ANALYTICS DASHBOARD
@app.route("/api/admin/analytics/users", methods=["GET"])
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

@app.route("/api/admin/analytics/activity", methods=["GET"])
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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')