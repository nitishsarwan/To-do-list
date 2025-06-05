from flask_pymongo import PyMongo
from db import mongo
from bson import ObjectId
from datetime import datetime

def create_task(user_id,title,description):
    created_at=datetime.utcnow().strftime("%d/%m/%Y")
    task_id = mongo.db.tasks.insert_one({
        "user_id": ObjectId(user_id),
        "title": title,
        "description": description,
        "completed": False,
        "created_at":created_at
    }).inserted_id
    return str(task_id)

