from .utils import wrap_request

import argon2, json, os, time

from flask import request, Response, g

from cryptbox import app

from cryptbox.database import db
from cryptbox.database.models.users import Users
from cryptbox.jwtutils import make_jwt

@app.route("/register", methods = ["POST"])
@wrap_request
def register():
  username = request.json["username"]
  password = request.json["password"]
  if Users.query.filter_by(username = username).count() > 0:
    return {"status": "fail", "error": "username_taken"}
  if set(username) - set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_."):
    return {"status": "fail", "error": "username_invalid"}
  if len(password) < 12:
    return {"status": "fail", "error": "password_short"}
  if set(password) & set("0123456789") == set() or set(password) & set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") == set():
    return {"status": "fail", "error": "password_simple"}
  salt = os.urandom(16)
  u = Users(username = username, password_hash = argon2.argon2_hash(password, salt), salt = salt, public_key = "", encrypted_private_key = "")
  db.session.add(u)
  db.session.commit()
  g.setdefault("cookies", {})["token"] = make_jwt({"uid": u.id, "at": int(time.time()), "exp": int(time.time()) + 604800}, app.config["SECRET_KEY"])
  return {"status": "ok", "username": u.username}