from flask import Blueprint
from controllers.task_controller import create_new_task,delete_task,getAllTasks,get_task_by_id,update_task

task_bp=Blueprint("task_bp", __name__)
task_bp.route("/getAllTasks", methods=["GET"])(getAllTasks) 
task_bp.route("/getTask/<task_id>", methods=["GET"])(get_task_by_id)  
task_bp.route("/createTask", methods=["POST"])(create_new_task)
task_bp.route("/updateTask/<task_id>", methods=["PUT"])(update_task)  
task_bp.route("/deleteTask/<task_id>", methods=["DELETE"])(delete_task)