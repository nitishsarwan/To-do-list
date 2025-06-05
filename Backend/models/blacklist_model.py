from flask_pymongo import PyMongo
from db import mongo
from datetime import datetime


def add_to_blacklist(token):
    mongo.db.blacklist.insert_one({
        "token": token,
        "created_at": datetime.utcnow()
        })
    return True