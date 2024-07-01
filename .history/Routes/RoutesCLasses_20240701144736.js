const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");


const { createClasses,getClassess, getClass } = require("../Service/ClassService");
const { getClassValidator } = require("../Resuble/ClassValidationError copy");


const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createClas, createClasses)
.get(getClassess);
Routes.route("/:id")
  .get(getClassValidator, getClass)
module.exports = Routes;
