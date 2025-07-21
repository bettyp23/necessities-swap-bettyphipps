# Necessities Swap MVP

## Project Overview
This is the MVP for the Necessities Swap application — a platform where college students can post, browse, and claim items for giveaway or trade. The app features a React frontend, Flask backend, and MongoDB Atlas database.

## Features
- Functional React form pages for posting items  
- End-to-end flow: submit item → store in MongoDB → display updated item list  
- Backend API built with Flask, handling CRUD operations  
- Cloud-hosted MongoDB Atlas database  
- CORS enabled for frontend-backend communication  

## Getting Started

### Prerequisites
- Python 3.10+  
- Node.js & npm  
- MongoDB Atlas account and connection URI

#### Backend Setup

Navigate to the backend folder, create and activate a virtual environment, install dependencies, set up environment variables, and run the Flask server:

```bash

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
npm start