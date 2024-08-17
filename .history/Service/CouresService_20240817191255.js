const expressAsyncHandler = require("express-async-handler");
const factory = require("./FactoryHandler");
const ApiError = require("../Resuble/ApiErrors");
const createLecturesModel = require("../Modules/createAlecture");
const createCouresModel = require("../Modules/createCouress");
const createCouponsModel = require("../Modules/createCoupon");
const createTransactionModel = require("../Modules/createtransaction");
const createTeachersModel = require("../Modules/createTeacher");
const createUsersModel = require("../Modules/createUsers");
const os = require("os");
const createSectionModel = require("../Modules/createSection");

//   //Cheack the coupon if it exists and find the coupon by code and expiration
//   const couponModel = await createCouponsModel.findOne({
//     code: req.body.coupon,
//     expires: { $gt: Date.now() },
//   });

//   //Cheack the lacture if it not exists and find the lacture by id

//   if (!lactureModel) next(new ApiError(`Lacture ID Not Found`, 500));
//   // Check if the lactureModel.price < req.user.point
//   if (lactureModel.price > req.user.point)
//     next(
//       new ApiError(
//         `Price Lecture: ${lactureModel.price} > Your Point ${req.user.point}`,
//         500
//       )
//     );

//   // Check if the code is already valid
//   if (!couponModel)
//     next(new ApiError(`Coupon Is not Vaild: ${req.body.coupon}`, 500));

//   // Calculate total price after discount
//   const totalPriceAfterDiscount = (
//     lactureModel.price -
//     (lactureModel.price * couponModel.discount) / 100
//   ).toFixed(0);

//   let coures = await createCouresModel.findOne({ user: req.user._id });
//   const { lacture } = req.body;
//   if (!coures) {
//     coures = await createCouresModel.create({
//       user: req.user._id,
//       teacher: [
//         {
//           name: lactureModel.teacher.name,
//           teacherID: lactureModel.teacher._id,
//         },
//       ],
//       couresItems: [
//         {
//           lacture,
//           teacherID: lactureModel.teacher._id,
//           coupon: couponModel.code,
//           discount: couponModel.discount,
//         },
//       ],
//     });
//   } else {
//     const couresExists = coures.couresItems.findIndex(
//       (item) => item.lacture._id.toString() === lacture.toString()
//     );
//     const couresTeacher = coures.teacher.findIndex(
//       (item) => item.teacherID === lactureModel.teacher._id.toString()
//     );

//     if (couresExists > -1) {
//       const cartItem = coures.couresItems[couresExists];
//       const cartTeacher = coures.teacher[couresTeacher];
//       cartItem.discount = couponModel.discount;
//       cartItem.coupon = couponModel.code;
//       (teacher = cartTeacher), (coures.couresItems = cartItem);
//     } else {
//       coures.couresItems.push({
//         lacture,
//         teacherID: lactureModel.teacher._id,
//         coupon: couponModel.code,
//         discount: couponModel.discount,
//       });
//       coures.teacher.push({
//         name: lactureModel.teacher.name,
//         teacherID: lactureModel.teacher._id,
//       });
//     }
//   }

//   const transaction = new createTransactionModel({
//     sender: req.user._id,
//     receiver: lactureModel.teacher._id,
//     pointsSent:
//       totalPriceAfterDiscount > 0
//         ? totalPriceAfterDiscount
//         : lactureModel.price,
//   });
//   const teacherModel = await createTeachersModel.findById(
//     lactureModel.teacher._id
//   );

//   teacherModel.point += +totalPriceAfterDiscount;
//   await createUsersModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       point: req.user.point - totalPriceAfterDiscount,
//     },
//     { new: true }
//   );
//   const deleteDoc = await createCouponsModel.findByIdAndDelete(couponModel);
//   await transaction.save();
//   await teacherModel.save();
//   await coures.save();
//   res.status(200).json({
//     status: `Successfully deleted Coupon: ${deleteDoc.code}`,
//     data: {
//       coures,
//       transaction,
//     },
//   });
// });
function getServerIp() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    for (const net of networkInterface) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "Unable to determine server IP";
}

exports.createCoures = expressAsyncHandler(async (req, res, next) => {
  try {
    const serverIp = getServerIp();

    // العثور على المحاضرة والفصل باستخدام ID
    const lactureModel = req.body.lacture
      ? await createLecturesModel.findById(req.body.lacture)
      : null;
    const sectionModel = req.body.section
      ? await createSectionModel.findById(req.body.section)
      : null;

    if (!lactureModel && !sectionModel) {
      return next(new ApiError(`Course Must Be Lecture Or Section`, 500));
    }

    // التحقق من صحة الكوبون وتاريخ انتهاء صلاحيته
    const couponModel = await createCouponsModel.findOne({
      code: req.body.coupon,
      expires: { $gt: Date.now() },
    });

    // تحديد السعر بناءً على المحاضرة أو الفصل
    const price = lactureModel ? lactureModel.price : sectionModel.price;

    // التحقق من نقاط المستخدم
    if (price > req.user.point) {
      return next(
        new ApiError(
          `Price (${price}) is greater than your points (${req.user.point})`,
          500
        )
      );
    }

    let coures = await createCouresModel.findOne({ user: req.user._id });

    if (!coures) {
      // إنشاء كورس جديد إذا لم يكن موجودًا
      coures = await createCouresModel.create({
        user: req.user._id,
        teacher: [
          {
            name: sectionModel
              ? sectionModel.class.teacher.name
              : lactureModel.section.class.teacher.name,
            teacherID: sectionModel
              ? sectionModel.class.teacher._id
              : lactureModel.section.class.teacher._id,
          },
        ],
        couresItems: [],
      });
    }

    // إذا تم إرسال الفصل، جلب جميع المحاضرات المرتبطة به
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
          // إضافة المحاضرة إذا لم تكن موجودة بالفعل
          coures.couresItems.push({
            lacture: lecture,
            teacherID: sectionModel.class.teacher._id,
            coupon:{
coupon
            }
            discount: couponModel ? couponModel.discount : null,
            ip: serverIp,
          });
          lecturesAdded = true;
        }
      }

      if (lecturesAdded) {
        await coures.save(); // حفظ التغييرات فقط إذا تمت إضافة محاضرات جديدة
      }
    } else if (lactureModel) {
      const lectureExistsIndex = coures.couresItems.findIndex(
        (item) => item.lacture._id.toString() === lactureModel._id.toString()
      );

      if (lectureExistsIndex === -1) {
        // إضافة المحاضرة إذا لم تكن موجودة بالفعل
        coures.couresItems.push({
          lacture: lactureModel,
          teacherID: sectionModel
            ? sectionModel.class.teacher._id
            : lactureModel.section.class.teacher._id,
          coupon: couponModel ? couponModel.code : null,
          discount: couponModel ? couponModel.discount : null,
          ip: serverIp,
        });
        await coures.save(); // حفظ التغييرات فقط إذا تمت إضافة محاضرة جديدة
      } else {
        return res.status(400).json({
          status: "Failure",
          message: "Lecture already exists in the course. No update needed.",
        });
      }
    }

    const totalPriceAfterDiscount = couponModel
      ? (price - (price * couponModel.discount) / 100).toFixed(0)
      : price;

    // إنشاء المعاملة
    const transaction = new createTransactionModel({
      sender: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
      receiver: {
        id: sectionModel
          ? sectionModel.class.teacher._id
          : lactureModel.section.class.teacher._id,
        name: sectionModel
          ? sectionModel.class.teacher.name
          : lactureModel.section.class.teacher.name,
        role: "teacher",
      },

      pointsSent: totalPriceAfterDiscount,
    });

    // تحديث نقاط المعلم والمستخدم
    const teacherModel = await createTeachersModel.findById(
      sectionModel
        ? sectionModel.class.teacher._id
        : lactureModel.section.class.teacher._id
    );
    teacherModel.point += +totalPriceAfterDiscount;

    const user = await createUsersModel.findByIdAndUpdate(
      req.user._id,
      { point: req.user.point - totalPriceAfterDiscount },
      { new: true }
    );

    // حذف الكوبون بعد استخدامه
    if (couponModel) {
      await createCouponsModel.findByIdAndDelete(couponModel._id);
    }
    user.ip = serverIp;

    // حفظ التغييرات
    await user.save();
    await transaction.save();
    await teacherModel.save();

    res.status(200).json({
      data: {
        coures,
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
});

exports.getCouress = expressAsyncHandler(async (req, res, next) => {
  const coures = await createCouresModel.findOne({ user: req.user._id });

  if (!coures) {
    return next(
      new ApiError(`There is no coures for this user id : ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    results: coures.couresItems.length,
    data: coures,
  });
});
exports.getCoures = factory.getOne(createCouresModel);
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
      return next(new ApiError("There is no course for this user"));
    }

    const itemsIndex = course.couresItems.findIndex(
      (item) => item._id.toString() === req.params.id
    );
    if (itemsIndex > -1) {
      const courseItem = course.couresItems[itemsIndex];
      courseItem.seen -= 1;

      if (courseItem.seen === 0) {
        course.couresItems.splice(itemsIndex, 1);
      } else {
        course.couresItems[itemsIndex] = courseItem;
      }

      await course.save(); // حفظ التحديثات
      res.status(200).json({
        status: "success",
        message: courseItem.seen === 0 ? "Item deleted" : "Item updated",
        data: course,
      });
    } else {
      return next(new ApiError("There is no course item with the provided ID"));
    }
  }
);
