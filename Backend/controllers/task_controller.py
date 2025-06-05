from flask import request, jsonify
from bson.objectid import ObjectId
from db import mongo
from models.task_model import create_task
from models.user_model import find_user
from controllers.auth_controller import token_required
import jwt
import json
import redis
r = redis.Redis(host='localhost', port=6379, db=0)



@token_required
def create_new_task(current_user):
    user_id= str(current_user["_id"])
    data= request.get_json()
    title = data.get("title")
    description = data.get("description")
    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400
    task_id = create_task(user_id, title, description)
    if not task_id:
        return jsonify({"error": "Failed to create task"}), 500
    mongo.db.users.update_one({
        "_id": ObjectId(user_id)
    }, {
        "$push": {
            "tasks": ObjectId(task_id)
        }
    })
    r.delete(f"tasks:user:{user_id}")

    task = mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        return jsonify({"error": "Task not found"}), 404
    task["_id"] = str(task["_id"])  
    user = find_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])
    if "tasks" in user:
        user["tasks"]=[str(t) for t in user["tasks"]]
    return jsonify({
        "status": "success",
        "message": "Task created successfully",
        "task": task,
        "user": user
    }), 201
    

    
@token_required
def getAllTasks(current_user):
    user_id = str(current_user["_id"])
    cache_key= f"tasks:user:{user_id}"
    cache_tasks = r.get(cache_key)
    if cache_tasks:
        result=json.loads(cache_tasks)
        # print("Cache hit for user tasks")
        return jsonify(result), 200
    
    user = find_user(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    task_ids= user.get("tasks", [])
    if not task_ids:
        return jsonify({"message": "No tasks found for this user"}), 200
    
    tasks = mongo.db.tasks.find({"_id": {"$in": [ObjectId(t) for t in task_ids]}})
    tasks_list = [] 
    for task in tasks:
        task["_id"] = str(task["_id"])
        if 'user_id' in task:
            task["user_id"] = str(task["user_id"])
        tasks_list.append(task)
    user["_id"] = str(user["_id"])  
    if "tasks" in user:
        user["tasks"] = [str(t) for t in user["tasks"]]
    result= {
        "status": "success",
        "message": "Tasks fetched successfully",
        "total": len(tasks_list),
        "tasks": tasks_list,
        "user": user
    }
    r.setex(cache_key, 300, json.dumps(result))
    return jsonify(result), 200

@token_required 
def get_task_by_id(current_user,task_id):
    user_id = str(current_user["_id"])
    #create a cache key for the task
    cache_key=f"task_{task_id}"
    cache_task=r.get(cache_key)
    if cache_task:
        task=json.loads(cache_task)
    else:
         task = mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
         if not task:
            return jsonify({"error": "Task not found"}), 404
         task["_id"]=str(task["_id"])
         if "user_id" in task:
             task["user_id"] = str(task["user_id"])
         r.setex(cache_key, 300, json.dumps(task))  # Set cache for 5 minutes
   
    if str(task["user_id"]) != user_id:
        return jsonify({"error": "You are not authorized to view this task"}), 403
    return jsonify({
        "status": "success",
        "message": "Task fetched successfully",
        "task": task
    }), 200

@token_required
def update_task(current_user,task_id):
    user_id = str(current_user["_id"])
    task = mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        return jsonify({"error": "Task not found"}), 404
    if str(task["user_id"]) != user_id:
        return jsonify({"error": "You are not authorized to update this task"}), 403
    data = request.get_json()
    if data.get('title') :
        title = data.get("title")
    else:
        title = task.get("title")
    if data.get('description'):
        description = data.get("description")
    else:
        description = task.get("description")
    if data.get("completed"):
        completed = data.get("completed")
        mongo.db.tasks.update_one({"_id": ObjectId(task_id)}, {
            "$set": {
                "completed": completed
            }
        })
    else:
        completed = task.get("completed")
    mongo.db.tasks.update_one({"_id": ObjectId(task_id)}, {
        "$set": {
            "title": title,
            "description": description
        }
    })  
    r.delete(f"task_{task_id}")
    r.delete(f"tasks:user:{user_id}")
    updated_task = mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
    if not updated_task:
        return jsonify({"error": "Failed to update task"}), 500
    updated_task["_id"] = str(updated_task["_id"])
    return jsonify({
        "status": "success",
        "message": "Task updated successfully",
        "task": updated_task
    }), 200

@token_required
def delete_task(current_user,task_id):
    user_id = str(current_user["_id"])
    task=mongo.db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        return jsonify({"error": "Task not found"}), 404
    if str(task["user_id"]) != user_id:
        return jsonify({"error": "You are not authorized to delete this task"}), 403
    mongo.db.tasks.delete_one({"_id": ObjectId(task_id)})
    mongo.db.users.update_one({
        "_id": ObjectId(user_id)
    }, {
        "$pull": {
            "tasks": ObjectId(task_id)
        }
    })
    r.delete(f"task_{task_id}")
    r.delete(f"tasks:user:{user_id}")
    return jsonify({"status": "success","message": "Task deleted successfully"}), 200