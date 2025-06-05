from flask import request, jsonify,make_response
from bson import ObjectId
from werkzeug.security import generate_password_hash,check_password_hash
from db import mongo
from models.user_model import create_user, find_user
from models.blacklist_model import add_to_blacklist
import jwt
from functools import wraps
import datetime 
import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token= request.headers.get("Authorization") or request.cookies.get("token")
        token= token.split(" ")[1] if token and token.startswith("Bearer ") else token
        if not token:
            return jsonify({"error": "Unauthorized!"}), 401
        isBlacklisted = mongo.db.blacklist.find_one({"token": token})
        if isBlacklisted:
            return jsonify({"error": "Unauthorized!"}), 401
        try:
            data=jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data["user_id"]
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
            if not user:
                return jsonify({"error": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        return f(user, *args, **kwargs)
    return decorated

def signup():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON in request'}), 400

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
   

    if not name or not email or not password:
        return jsonify({'error': "All fields are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409

    # hash_password = generate_password_hash(password)
    # user_id=mongo.db.users.insert_one({
    #     "name": name,
    #     "email": email,
    #     "password": hash_password
    # }).inserted_id

    user_id=create_user(name,email,password)
    
    token=jwt.encode({
        "user_id":str(user_id),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    },
    SECRET_KEY,
    algorithm="HS256"
    )
    user=find_user(user_id)
    resp=make_response(
        jsonify({"status":"success","message": "Signup successful","token":token,"data":user}), 201
    )
    resp.set_cookie("token", token)
    return resp


def login():
    data=request.get_json()
    email=data.get("email")
    password=data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user=mongo.db.users.find_one({"email":email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    if not check_password_hash(user["password"],password):
        return jsonify({"error": "Invalid email or password"}), 401
    token=jwt.encode({
        "user_id": str(user["_id"]),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    },
    SECRET_KEY,
    algorithm="HS256"
    )
    resp=make_response(jsonify({"status": "success",
                 "message": "Login successful",
                 "token":token,
                 "data":user
                 }), 201
    )
    resp.set_cookie("token", token)
    return resp


@token_required
def profile(current_user):
    return jsonify({"status": "success",
        "message": "Profile fetched successfully","data": current_user
    }), 200

@token_required
def logout(current_user):
    token = request.headers.get("Authorization") or request.cookies.get("token")
    if token and token.startswith("Bearer "):
        token = token.split(" ")[1]
    add_to_blacklist(token)
    resp = make_response(jsonify({"status": "success",
        "message": "Logout successful"}), 200)
    resp.set_cookie("token", "", expires=0)
    return resp
   
   

