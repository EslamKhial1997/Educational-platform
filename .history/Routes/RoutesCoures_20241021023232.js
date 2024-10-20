const express = require("express");
const {
  protect,
  allowedTo,
  getLoggedUserData,
} = require("../Service/AuthService");
const {
  createCoures,
  getCoures,
  deleteSpecificCourseItem,
  updateSpecificCourseItemSeen,
} = require("../Service/CouresService");
const { createCourseValidator } = require("../Resuble/CouressValidationError");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("user"), createCourseValidator, createCoures)
  .get(protect, allowedTo("user"), getCoures);
Routes.route("/:id")
  .delete(deleteSpecificCourseItem)
  .put(updateSpecificCourseItemSeen);

module.exports = Routes;
