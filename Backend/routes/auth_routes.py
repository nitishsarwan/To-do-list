from flask import Blueprint
from controllers.auth_controller import signup
from controllers.auth_controller import login ,logout
from controllers.auth_controller import profile


auth_bp=Blueprint("auth_bp",__name__)
auth_bp.route("/signup",methods=["POST"])(signup)
auth_bp.route("/login",methods=["POST"])(login)  
auth_bp.route("/logout",methods=["POST"])(logout)
auth_bp.route("/profile",methods=["GET"])(profile)