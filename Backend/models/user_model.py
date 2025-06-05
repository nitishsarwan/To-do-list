from flask_pymongo import PyMongo
from db import mongo
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


def create_user(name,email,password):
    hash_password =generate_password_hash(password)
    user_id = mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hash_password,
        "tasks": []
    }).inserted_id
    return str(user_id)

def find_user(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
    return None

    