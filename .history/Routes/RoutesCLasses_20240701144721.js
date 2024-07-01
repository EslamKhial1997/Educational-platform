const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");


const { createClasses,getClassess, getClass } = require("../Service/ClassService");


const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createClassValidator, createClasses)
.get(getClassess);
Routes.route("/:id")
  .get(getClas, getClass)
module.exports = Routes;
