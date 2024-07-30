const expressAsyncHandler = require("express-async-handler");

const ApiError = require("../Resuble/ApiErrors");
const createLecturesModel = require("../Modules/createAlecture");
const createCouresModel = require("../Modules/createCouress");
const createCouponsModel = require("../Modules/createCoupon");
const createTransactionModel = require("../Modules/createtransaction");
const createTeachersModel = require("../Modules/createTeacher");
const createUsersModel = require("../Modules/createUsers");

exports.createCoures = expressAsyncHandler(async (req, res, next) => {
  const lactureModel = await createLecturesModel.findById(req.body.lacture);
  //Cheack the coupon if it exists and find the coupon by code and expiration
  const couponModel = await createCouponsModel.findOne({
    code: req.body.coupon,
    expires: { $gt: Date.now() },
  });
  console.log(req.body.lacture ,lactureModel.section);
  console.log(req.body.lacture === lactureModel.section._id.toString());
  //Cheack the lacture if it not exists and find the lacture by id
  if (!lactureModel) next(new ApiError(`Lacture ID Not Found`, 404));
  // Check if the lactureModel.price < req.user.point
  if (lactureModel.price > req.user.point) {
    return next(
      new ApiError(
        `Price Lecture: ${lactureModel.price} > Your Point ${req.user.point}`,
        500
      )
    );
  }
  // Check if the code is already valid
  if (!couponModel) {
    return next(new ApiError(`Coupon Is not Vaild: ${req.body.coupon}`, 404));
  }
  // Calculate total price after discount
  const totalPriceAfterDiscount = (
    lactureModel.price -
    (lactureModel.price * couponModel.discount) / 100
  ).toFixed(0);

  let coures = await createCouresModel.findOne({ user: req.user._id });

  const { lacture } = req.body;
  if (!coures) {
    coures = await createCouresModel.create({
      user: req.user._id,
      couresItems: [
        { lacture, coupon: couponModel.code, discount: couponModel.discount },
      ],
    });
  } else {
    const couresExists = coures.couresItems.findIndex(
      (item) => item.lacture._id.toString() === lacture.toString()
    );

    if (couresExists > -1) {
      const cartItem = coures.couresItems[couresExists];
      cartItem.discount = couponModel.discount;
      cartItem.coupon = couponModel.code;
      coures.couresItems = cartItem;
    } else {
      coures.couresItems.push({
        lacture,
        coupon: couponModel.code,
        discount: couponModel.discount,
      });
    }
  }

  const transaction = new createTransactionModel({
    sender: req.user._id,
    receiver: lactureModel.teacher._id,
    pointsSent:
      totalPriceAfterDiscount > 0
        ? totalPriceAfterDiscount
        : lactureModel.price,
  });
  const teacherModel = await createTeachersModel.findById(
    lactureModel.teacher._id
  );

  teacherModel.point += +totalPriceAfterDiscount;
  await createUsersModel.findByIdAndUpdate(
    req.user._id,
    {
      point: req.user.point - totalPriceAfterDiscount,
    },
    { new: true }
  );
  const deleteDoc = await createCouponsModel.findByIdAndDelete(couponModel);
  await transaction.save();
  await teacherModel.save();
  await coures.save();
  res.status(200).json({
    status: `Successfully deleted Coupon: ${deleteDoc.code}`,
    data: {
      coures,
      transaction,
    },
  });
});

exports.getCoures = expressAsyncHandler(async (req, res, next) => {
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
