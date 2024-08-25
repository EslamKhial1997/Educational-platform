const express = require("express");
const { protect, allowedTo } = require("../Service/AuthService");
const {
  createCoures,
  getCoures,
  getCouress,
  deleteSpecificCourseItem,
  updateSpecificCourseItemSeen,
} = require("../Service/CouresService");
const { createCourseValidator } = require("../Resuble/CouressValidationError");

const Routes = express.Router();
Routes.use(protect);
Routes.route("/")
  .post(allowedTo("user"), createCourseValidator, createCoures)
  .get(protect, allowedTo("user"),getLog, getCouress);

Routes.route("/:id")
  .get(protect, allowedTo("user"), getCoures)
  .delete(deleteSpecificCourseItem)
  .put(updateSpecificCourseItemSeen);

module.exports = Routes;
