import os

class Config:
    """Configuration for Flask application"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/necessities_swap')
    DEBUG = os.environ.get('FLASK_DEBUG', True)
    SESSION_TYPE = 'filesystem'
    SESSION_PERMANENT = False
