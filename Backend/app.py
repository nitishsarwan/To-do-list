from flask import Flask, jsonify
from flask_cors import CORS
from db import mongo
from routes.auth_routes import auth_bp
from routes.task_routes import task_bp
from dotenv import load_dotenv
import os

load_dotenv()  

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])

# MongoDB connection
app.config["MONGO_URI"] = MONGO_URI
mongo.init_app(app)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Todo API"}), 200
   

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
app.register_blueprint(task_bp, url_prefix="/api/v1/tasks")

if __name__ == "__main__":
    app.run(debug=True,threaded=False)
