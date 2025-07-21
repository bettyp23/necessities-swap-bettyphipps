import os

class Config:
    """Configuration for Flask application"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/your_database')
    DEBUG = os.environ.get('FLASK_DEBUG', True)
