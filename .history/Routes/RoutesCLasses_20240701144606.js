const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");


const { createClasses,getClassess, getClasses } = require("../Service/ClassService");
const { createClassValidator } = require("../Resuble/ClassValidationError copy");
const { getClassValidator } = require("../Resuble/SectionValidationError");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(createClassValidator, createClasses)
.get(getClassess);
Routes.route("/:id")
  .get(getClassValidator, getClasses)
module.exports = Routes;
