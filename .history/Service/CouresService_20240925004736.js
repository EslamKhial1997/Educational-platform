const expressAsyncHandler = require("express-async-handler");
const factory = require("./FactoryHandler");
const ApiError = require("../Resuble/ApiErrors");
const createLecturesModel = require("../Modules/createAlecture");
const createCouresModel = require("../Modules/createCouress");
const createCouponsModel = require("../Modules/createCoupon");
const createTransactionModel = require("../Modules/createtransaction");
const createTeachersModel = require("../Modules/createTeacher");
const createUsersModel = require("../Modules/createUsers");
const createSectionModel = require("../Modules/createSection");

exports.createCoures = expressAsyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // بدء المعاملة
  try {
    const serverIp = req.user.ip;

    const lactureModel = req.body.lacture
      ? await createLecturesModel.findById(req.body.lacture)
      : null;
    const sectionModel = req.body.section
      ? await createSectionModel.findById(req.body.section)
      : null;

    const couponModel = await createCouponsModel.findOneAndUpdate(
      {
        code: req.body.coupon,
        expires: { $gt: Date.now() },
        locked: false, // Only find coupons that haven't expired
      },
      { $set: { locked: true } },

      { new: true } // Return the updated document
    );

    const price = lactureModel ? lactureModel.price : sectionModel.price;
    const priceAfterDiscount = couponModel
      ? (price - (price * couponModel.discount) / 100).toFixed(0)
      : price;

    if (req.user.point < priceAfterDiscount) {
      await createCouponsModel.findOneAndUpdate(
        {
          code: req.body.coupon,
          expires: { $gt: Date.now() },
          locked: true, // Only find coupons that haven't expired
        },
        { $set: { locked: false } },

        { new: true } // Return the updated document
      );
      return next(
        res.status(500).json({
          status: "error",
          msg: `سعر المحاضره ${price} اكبر من رصيدك ${req.user.point}`,
        })
      );
    }

    let coures = await createCouresModel.findOne({ user: req.user._id });

    if (!coures) {
      coures = await createCouresModel.create({
        user: req.user._id,
        teacher: [],
        couresItems: [],
      });
    }

    const teacherId = sectionModel
      ? sectionModel.class.teacher._id.toString()
      : lactureModel.section.class.teacher._id.toString();

    const teacherExists = coures.teacher.some(
      (teacher) => teacher.teacherID.toString() === teacherId
    );

    if (!teacherExists) {
      coures.teacher.push({
        name: sectionModel
          ? sectionModel.class.teacher.name
          : lactureModel.section.class.teacher.name,
        teacherID: teacherId,
      });
    }

    if (sectionModel) {
      const lectures = await createLecturesModel.find({
        section: req.body.section,
      });

      let lecturesAdded = false;
      for (const lecture of lectures) {
        const lectureExistsIndex = coures.couresItems.findIndex(
          (item) => item.lacture._id.toString() === lecture._id.toString()
        );

        if (lectureExistsIndex === -1) {
          coures.couresItems.push({
            lacture: lecture,
            teacherID: teacherId,
            coupon: couponModel ? couponModel.code : null,
            expires: couponModel ? couponModel.expires : null,
            discount: couponModel ? couponModel.discount : null,
            ip: serverIp,
          });
          lecturesAdded = true;
        } else {
          return res.status(404).json({
            status: "Failure",
            msg: "الباب موجود من قبل",
          });
        }
      }

      if (lecturesAdded) {
        await coures.save();
      }
    } else if (lactureModel) {
      const lectureExistsIndex = coures.couresItems.findIndex(
        (item) => item.lacture._id.toString() === lactureModel._id.toString()
      );

      if (lectureExistsIndex === -1) {
        coures.couresItems.push({
          lacture: lactureModel,
          teacherID: teacherId,
          coupon: couponModel ? couponModel.code : null,
          expires: couponModel ? couponModel.expires : null,
          discount: couponModel ? couponModel.discount : null,
          ip: serverIp,
        });
        await coures.save();
      } else {
        await createCouponsModel.findOneAndUpdate(
          {
            code: req.body.coupon,
            expires: { $gt: Date.now() },
            locked: true, // Only find coupons that haven't expired
          },
          { $set: { locked: false } },

          { new: true } // Return the updated document
        );
        return res.status(404).json({
          status: "Failure",
          msg: "المحاضره موجوده من قبل",
        });
      }
    }

    const totalPriceAfterDiscount = couponModel
      ? (price - (price * couponModel.discount) / 100).toFixed(0)
      : price;

    const transaction = new createTransactionModel({
      sender: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
      receiver: {
        id: teacherId,
        name: sectionModel
          ? sectionModel.class.teacher.name
          : lactureModel.section.class.teacher.name,
        role: "teacher",
      },
      pointsSent: totalPriceAfterDiscount,
    });

    const teacherModel = await createTeachersModel.findById(teacherId);
    teacherModel.point += +totalPriceAfterDiscount;

    const user = await createUsersModel.findByIdAndUpdate(
      req.user._id,
      { point: req.user.point - totalPriceAfterDiscount },
      { new: true }
    );

    if (couponModel) {
      await createCouponsModel.findByIdAndDelete(couponModel._id);
    }

    await user.save();
    await transaction.save();
    await teacherModel.save();
    await session.commitTransaction();
    res.status(200).json({
      data: {
        coures,
        transaction,
      },
    });
  }catch (error) {
    await session.abortTransaction(); // إلغاء المعاملة عند حدوث خطأ
    next(error);
  } finally {
    session.endSession(); // إنهاء الجلسة
  }
});

exports.getCoures = factory.getOneCourse(createCouresModel);
exports.deleteCourses = factory.deleteOne(createCouresModel);
exports.deleteSpecificCourseItem = expressAsyncHandler(
  async (req, res, next) => {
    const coures = await createCouresModel.findOneAndUpdate(
      { user: req.user._id },
      {
        $pull: { couresItems: { _id: req.params.id } },
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: coures,
    });
  }
);
exports.updateSpecificCourseItemSeen = expressAsyncHandler(
  async (req, res, next) => {
    const course = await createCouresModel.findOne({ user: req.user._id });
    if (!course) {
      res.status(404).json({
        status: "error",
        msg: "لايوجد كورسات ",
      });
    }
    const itemsIndex = course.couresItems.findIndex(
      (item) => item._id.toString() === req.params.id
    );
    if (itemsIndex > -1) {
      const courseItem = course.couresItems[itemsIndex];
      courseItem.seen -= 1;

      if (
        courseItem.seen === 0 ||
        (courseItem.expires < Date.now() && courseItem.expires)
      ) {
        course.couresItems.splice(itemsIndex, 1);
      } else {
        course.couresItems[itemsIndex] = courseItem;
      }

      await course.save(); // حفظ التحديثات

      res.status(200).json({
        status: "success",
        msg: courseItem.seen === 0 ? "Item deleted" : "Item updated",
        data: course,
      });
    } else {
      return next(new ApiError("There is no course item with the provided ID"));
    }
  }
);
