<<<<<<< ⌬ Tabnine Instruct <<<<<<<
‌const mongoose = require("mongoose");
‌
‌const createLectures = new mongoose.Schema(
‌  {
‌    lecture: {
‌      type: "string",
‌      required: [true, "Lecture Is Required"],
‌    },
‌    price: {
‌      type: Number,
‌      default: 0,
‌      required: [true, "Lecture Price Is Required"],
‌    },
‌    image: {
‌      type: "string",
‌    },
‌    video: {
‌      type: "string",
‌      required: [true, "Video File Is Required"],
‌    },
‌    quiz: {
‌      type: "string",
‌      required: [true, "Quiz File Is Required"],
‌    },
‌    pdf: {
‌      type: "string",
‌      required: [true, "Pdf File Is Required"],
‌    },
‌
‌    section: {
‌      type: mongoose.Schema.ObjectId,
‌      ref: "Section",
‌      required: [true, "section ID Is Required"],
‌    },
‌    ip: String,
‌  },
‌  { timestamps: true }
‌);
‌createLectures.pre(/^find/, function (next) {
‌  this.populate({
‌    path: "section",
‌    select: "name",
‌  })
‌
‌  next();
‌});
‌const ImageURL = (doc) => {
‌  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/lecture`)) {
‌    const image = `${process.env.BASE_URL}/lecture/${doc.image}`;
‌    doc.image = image;
‌  }
‌};
‌createLectures.post("init", (doc) => {
‌  ImageURL(doc);
‌});
‌createLectures.post("save", (doc) => {
‌  ImageURL(doc);
‌});
‌const createLecturesModel = mongoose.model("Lectures", createLectures);
‌module.exports = createLecturesModel;
​/**
​ * This function is used to handle the upload of a single image using Multer middleware.
​ * It applies the MulterOptions configuration and returns a single file upload middleware.
​ *
​ * @param {string} ImageName - The name of the image field in the form data.
​ * @returns {Function} - A single file upload middleware function.
​ *
​ * @throws {ApiError} - Throws an ApiError if the uploaded file is not an image.
​ *
​ * @example
​ * const upload = require('./upload');
​ * const express = require('express');
​ * const router = express.Router();
​ *
​ * router.post('/upload', (req, res, next) => {
​ *   upload.UploadSingleImage('profileImage')(req, res, (err) => {
​ *     if (err) {
​ *       return next(err);
​ *     }
​ *     // Process the uploaded image
​ *   });
​ * });
​ */
​exports.UploadSingleImage = (ImageName) => MulterOptions().single(ImageName);
>>>>>>> ⌬ Tabnine Instruct >>>>>>>