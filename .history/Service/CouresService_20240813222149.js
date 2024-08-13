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
const createClassModel = require("../Modules/createClasses");
const createSectionModel = require("../Modules/createSection");
//   const lactureModel = await createLecturesModel.findById(req.body.lacture);
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
      // Skip over non-IPv4 and internal (i.e., 127.0.0.1) addresses
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
    // العثور على المحاضرة باستخدام ID
    const lactureModel = await createLecturesModel.findById(req.body.lacture);
    const sectionModel = await createSectionModel.findById(req.body.section);
    if (!lactureModel && !sectionModel) {
      return next(new ApiError(`Course Must Be Lecture Or Section`, 500));
    }
    const lactureModelExtandsSection = await createLecturesModel.find({ section: sectionModel._id});
    console.log(lactureModelExtandsSection);
    
    if (!sectionModel) {
      return next(new ApiError(`section ID Not Found`, 500));
    }

    // التحقق من صحة الكوبون وتاريخ انتهاء صلاحيته
    const couponModel = await createCouponsModel.findOne({
      code: req.body.coupon,
      expires: { $gt: Date.now() },
    });
    // if (!couponModel) {
    //   return next(new ApiError(`Coupon is not valid: ${req.body.coupon}`, 500));
    // }

    // التحقق من نقاط المستخدم
    if (lactureModel?.price || > req.user.point) {
      return next(
        new ApiError(
          `Price Lecture: ${lactureModel.price} > Your Points ${req.user.point}`,
          500
        )
      );
    }

    // حساب السعر الإجمالي بعد الخصم
    const section = await createSectionModel.findById(lactureModel.section._id);

    let coures = await createCouresModel.findOne({ user: req.user._id });
    const { lacture , seaction} = req.body;

    if (!coures && !couponModel) {
      // إذا لم يكن هناك كورس، أنشئ كورس جديد
      coures = await createCouresModel.create({
        user: req.user._id,
        teacher: [
          {
            name: section.class.teacher.name,
            teacherID: section.class.teacher._id,
          },
        ],
        couresItems: [
          {
            ip: serverIp,
            lacture,
            teacherID: section.class.teacher._id,
            coupon: couponModel ? couponModel.code : null,
            discount: couponModel ? couponModel.discount : null,
          },
        ],
      });
    } else {
      // التحقق إذا كانت المحاضرة موجودة بالفعل في الدورة
      const courseExistsIndex = coures.couresItems.findIndex(
        (item) => item.lacture._id.toString() === lacture.toString()
      );

      if (courseExistsIndex === -1) {
        // إذا لم تكن المحاضرة موجودة، أضفها إلى الدورة
        coures.couresItems.push({
          lacture,
          teacherID: section.class.teacher._id,
          coupon: couponModel ? couponModel.code : null,
          discount: couponModel ? couponModel.discount : null,
        });

        // التحقق من أن المعلم غير موجود بالفعل في القائمة، إذا لم يكن موجودًا، إضافته
        const courseTeacherIndex = coures.teacher.findIndex(
          (item) =>
            item.teacherID.toString() === section.class.teacher._id.toString()
        );

        if (courseTeacherIndex === -1) {
          coures.teacher.push({
            name: section.class.teacher.name,
            teacherID: section.class.teacher._id,
          });
        }
      } else {
        // إذا كانت المحاضرة موجودة بالفعل، لا يتم إجراء أي تحديث
        return res.status(400).json({
          status: "Failure",
          message: "Lecture already exists in the course. No update needed.",
        });
      }
    }

    const totalPriceAfterDiscount = couponModel
      ? (
          lactureModel.price -
          (lactureModel.price * couponModel.discount) / 100
        ).toFixed(0)
      : lactureModel.price;

    // إنشاء المعاملة
    const transaction = new createTransactionModel({
      sender: req.user._id,
      receiver: section.class.teacher._id,
      pointsSent:
        totalPriceAfterDiscount > 0
          ? totalPriceAfterDiscount
          : lactureModel.price,
    });

    // تحديث نقاط المعلم والمستخدم
    const teacherModel = await createTeachersModel.findById(
      section.class.teacher._id
    );
    teacherModel.point += +totalPriceAfterDiscount;

    const user = await createUsersModel.findByIdAndUpdate(
      req.user._id,
      {
        point: req.user.point - totalPriceAfterDiscount,
      },
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
    await coures.save();

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
// exports.deleteCart = expressAsyncHandler(async (req, res, next) => {
//   await createCartModel.findOneAndDelete({ user: req.user._id });
//   res.status(204).json({
//     status: "success",
//   });
// });
// exports.deleteSpecificCartItem = expressAsyncHandler(async (req, res, next) => {
//   const cart = await createCartModel.findOneAndUpdate(
//     { user: req.user._id },
//     {
//       $pull: { cartItems: { _id: req.params.id } },
//     },
//     { new: true }
//   );
//   calcTotalPrice(cart);
//   res.status(200).json({
//     status: "success",
//     data: cart,
//   });
// });
// exports.updateSpecificCartItemQuantity = expressAsyncHandler(
//   async (req, res, next) => {
//     const cart = await createCartModel.findOne({ user: req.user._id });
//     if (!cart) {
//       return next(new ApiError("There is no cart with id "));
//     }
//     const itemsIndex = cart.cartItems.findIndex(
//       (item) => item._id.toString() === req.params.id
//     );
//     if (itemsIndex > -1) {
//       const cartItem = cart.cartItems[itemsIndex];
//       cartItem.quantity = req.body.quantity;
//       cart.cartItems[itemsIndex] = cartItem;
//     } else {
//       // await cart.cartItems.push({ product, color, price: productModel.price });
//       return next(new ApiError("There is no cart with id "));
//     }
//     calcTotalPrice(cart);
//     await cart.save();
//     res.status(200).json({
//       status: "success",
//       results: cart.cartItems.length,
//       data: cart,
//     });
//   }
// );

// exports.ApplyCoupon = expressAsyncHandler(async (req, res, next) => {
//   const coupon = await createCouponModel.findOne({
//     name: req.body.coupon,
//     expires: { $gt: Date.now() },
//   });
//   if (!coupon) {
//     return next(new ApiError(`Coupon is invalid or expired`));
//   }

//   const cart = await createCartModel.findOne({ user: req.user.id });

//   const totalPrice = cart.totalCartPrice;

//   const totalPriceAfterDiscount = (
//     totalPrice -
//     (totalPrice * coupon.discount) / 100
//   ).toFixed(2);

//   cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
//   await cart.save();
//   res.status(200).json({
//     status: "success",
//     numOfCartItems: cart.cartItems.length,
//     data: cart,
//   });
// });
