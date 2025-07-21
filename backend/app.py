from flask import Flask, jsonify
from flask_cors import CORS
from controllers.user_controller import user_bp
from controllers.item_controller import item_bp
from controllers.admin_controller import admin_bp
from config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(item_bp, url_prefix='/api/items')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Root route for testing
    @app.route('/')
    def index():
        return jsonify({
            "status": "success",
            "message": "Necessities Swap API is running"
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "status": "error",
            "message": "The requested resource was not found"
        }), 404
    
    @app.errorhandler(500)
    def server_error(e):
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
