const expressAsyncHandler = require("express-async-handler");

const ApiError = require("../Resuble/ApiErrors");
const createLecturesModel = require("../Modules/createAlecture");
const createCouresModel = require("../Modules/createCouress");
const createCouponsModel = require("../Modules/createCoupon");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((items) => {
    totalPrice += items.quantity * items.price;
  });
  cart.totalCartPrice = totalPrice;
};
exports.createCoures = expressAsyncHandler(async (req, res, next) => {
  const lactureModel = await createLecturesModel.findById(req.body.lacture);
  const couponModel = await createCouponsModel.findOne({
    code: req.body.coupon,
  });
  console.log(expires);
  //Check if the code is already valid
  if (couponModel.expires < Date.now()) {
    return next(new ApiError(400, "Expires Coupon"));
  }
  let coures = await createCouresModel.findOne({ user: req.user._id });

  if (!lactureModel) next(new ApiError(`Lacture ID Not Found`, 404));

  const { lacture, coupon } = req.body;
  if (!coures) {
    coures = await createCouresModel.create({
      user: req.user._id,
      couresItems: [{ lacture, coupon:couponModel.code , discount:couponModel.discount }],
    });
  } else {
    const couresExists = coures.couresItems.findIndex(
      (item) => item.lacture._id.toString() === lacture.toString()
    );
    if (couresExists > -1) {
      const cartItem = coures.couresItems[couresExists];

      coures.couresItems = cartItem;
    } else {
      await coures.couresItems.push({ lacture, coupon });
    }
  }

  await coures.save();
  res.status(200).json({
    status: "success",

    data: coures,
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
