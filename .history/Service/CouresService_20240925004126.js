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

exports.createCourse = expressAsyncHandler(async (req, res, next) => {
  const session = await mongoo.startSession();
  session.startTransaction(); // بدء المعاملة

  try {
    const serverIp = req.user.ip;

    const lectureModel = req.body.lecture
      ? await createLecturesModel.findById(req.body.lecture).session(session)
      : null;
    const sectionModel = req.body.section
      ? await createSectionModel.findById(req.body.section).session(session)
      : null;

    // البحث عن القسيمة والتحقق من صلاحيتها
    const couponModel = await createCouponsModel.findOneAndUpdate(
      {
        code: req.body.coupon,
        expires: { $gt: Date.now() },
        locked: false, // التأكد من أن الكوبون غير مقفل
      },
      { locked: true }, // قفل الكوبون عند استخدامه
      { new: true, session } // استخدام المعاملة
    );

    // تحقق مما إذا كان الكوبون موجودًا
    if (!couponModel) {
      return res.status(400).json({
        status: "error",
        msg: "الكوبون غير صالح أو تم استخدامه بالفعل",
      });
    }

    // تحديد السعر بناءً على المحاضرة أو القسم
    const price = lectureModel ? lectureModel.price : sectionModel.price;
    const priceAfterDiscount = (price - (price * couponModel.discount) / 100).toFixed(0);

    // التحقق من أن المستخدم لديه نقاط كافية
    if (req.user.point < priceAfterDiscount) {
      return res.status(400).json({
        status: "error",
        msg: `سعر المحاضرة ${price} أكبر من رصيدك ${req.user.point}`,
      });
    }

    // متابعة العملية كما كانت
    let course = await createCourseModel.findOne({ user: req.user._id }).session(session);

    if (!course) {
      course = await createCourseModel.create([{
        user: req.user._id,
        teacher: [],
        courseItems: [],
      }], { session });
    }

    const teacherId = sectionModel
      ? sectionModel.class.teacher._id.toString()
      : lectureModel.section.class.teacher._id.toString();

    // التحقق مما إذا كان المعلم موجوداً بالفعل في قائمة المعلمين
    const teacherExists = course.teacher.some(
      (teacher) => teacher.teacherID.toString() === teacherId
    );

    // إضافة المعلم إذا لم يكن موجوداً
    if (!teacherExists) {
      course.teacher.push({
        name: sectionModel
          ? sectionModel.class.teacher.name
          : lectureModel.section.class.teacher.name,
        teacherID: teacherId,
      });
    }

    // التعامل مع القسم والمحاضرات
    if (sectionModel) {
      const lectures = await createLecturesModel.find({
        section: req.body.section,
      }).session(session);

      let lecturesAdded = false;
      for (const lecture of lectures) {
        const lectureExistsIndex = course.courseItems.findIndex(
          (item) => item.lecture._id.toString() === lecture._id.toString()
        );

        // إضافة المحاضرة إذا لم تكن موجودة
        if (lectureExistsIndex === -1) {
          course.courseItems.push({
            lecture: lecture,
            teacherID: teacherId,
            coupon: couponModel.code,
            expires: couponModel.expires,
            discount: couponModel.discount,
            ip: serverIp,
          });
          lecturesAdded = true;
        } else {
          return res.status(409).json({
            status: "Failure",
            msg: "المحاضرة موجودة مسبقاً",
          });
        }
      }

      if (lecturesAdded) {
        await course.save({ session });
      }
    } else if (lectureModel) {
      const lectureExistsIndex = course.courseItems.findIndex(
        (item) => item.lecture._id.toString() === lectureModel._id.toString()
      );

      // إضافة المحاضرة إذا لم تكن موجودة
      if (lectureExistsIndex === -1) {
        course.courseItems.push({
          lecture: lectureModel,
          teacherID: teacherId,
          coupon: couponModel.code,
          expires: couponModel.expires,
          discount: couponModel.discount,
          ip: serverIp,
        });
        await course.save({ session });
      } else {
        return res.status(409).json({
          status: "Failure",
          msg: "المحاضرة موجودة مسبقاً",
        });
      }
    }

    // حساب السعر الإجمالي بعد الخصم
    const totalPriceAfterDiscount = priceAfterDiscount;

    // إنشاء المعاملة
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
          : lectureModel.section.class.teacher.name,
        role: "teacher",
      },
      pointsSent: totalPriceAfterDiscount,
    });

    // تحديث نقاط المعلم
    const teacherModel = await createTeachersModel.findById(teacherId).session(session);
    teacherModel.point += +totalPriceAfterDiscount;

    // تحديث نقاط المستخدم
    const user = await createUsersModel.findByIdAndUpdate(
      req.user._id,
      { point: req.user.point - totalPriceAfterDiscount },
      { new: true, session }
    );

    // حذف القسيمة إذا تم استخدامها
    await createCouponsModel.findByIdAndDelete(couponModel._id, { session });

    // حفظ جميع التغييرات
    await user.save({ session });
    await transaction.save({ session });
    await teacherModel.save({ session });

    await session.commitTransaction(); // تأكيد المعاملة
    res.status(200).json({
      data: {
        course,
        transaction,
      },
    });
  } catch (error) {
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
