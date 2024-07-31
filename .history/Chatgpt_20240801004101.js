exports.createCoures = expressAsyncHandler(async (req, res, next) => {
  try {
    // العثور على المحاضرة باستخدام ID
    const lactureModel = await createLecturesModel.findById(req.body.lacture);
    if (!lactureModel) {
      return next(new ApiError(`Lecture ID Not Found`, 500));
    }

    // التحقق من صحة الكوبون وتاريخ انتهاء صلاحيته
    const couponModel = await createCouponsModel.findOne({
      code: req.body.coupon,
      expires: { $gt: Date.now() },
    });
    if (!couponModel) {
      return next(new ApiError(`Coupon is not valid: ${req.body.coupon}`, 500));
    }

    // التحقق من نقاط المستخدم
    if (lactureModel.price > req.user.point) {
      return next(
        new ApiError(
          `Price Lecture: ${lactureModel.price} > Your Points ${req.user.point}`,
          500
        )
      );
    }

    // حساب السعر الإجمالي بعد الخصم
    const totalPriceAfterDiscount = (
      lactureModel.price -
      (lactureModel.price * couponModel.discount) / 100
    ).toFixed(0);

    let coures = await createCouresModel.findOne({ user: req.user._id });
    const { lacture } = req.body;

    if (!coures) {
      coures = await createCouresModel.create({
        user: req.user._id,
        teacher: [
          {
            name: lactureModel.teacher.name,
            teacherID: lactureModel.teacher._id,
          },
        ],
        couresItems: [
          {
            lacture,
            teacherID: lactureModel.teacher._id,
            coupon: couponModel.code,
            discount: couponModel.discount,
          },
        ],
      });
    } else {
      const courseExistsIndex = coures.couresItems.findIndex(
        (item) => item.lacture.toString() === lacture.toString()
      );

      if (courseExistsIndex > -1) {
        // تحديث الخصم والكوبون إذا كانت المحاضرة موجودة بالفعل
        coures.couresItems[courseExistsIndex].discount = couponModel.discount;
        coures.couresItems[courseExistsIndex].coupon = couponModel.code;
      } else {
        // إضافة المحاضرة إذا لم تكن موجودة
        coures.couresItems.push({
          lacture,
          teacherID: lactureModel.teacher._id,
          coupon: couponModel.code,
          discount: couponModel.discount,
        });

        // التحقق من أن المعلم غير موجود بالفعل في القائمة، إذا لم يكن موجودًا، إضافته
        const courseTeacherIndex = coures.teacher.findIndex(
          (item) => item.teacherID.toString() === lactureModel.teacher._id.toString()
        );

        if (courseTeacherIndex === -1) {
          coures.teacher.push({
            name: lactureModel.teacher.name,
            teacherID: lactureModel.teacher._id,
          });
        }
      }
    }

    // إنشاء المعاملة
    const transaction = new createTransactionModel({
      sender: req.user._id,
      receiver: lactureModel.teacher._id,
      pointsSent:
        totalPriceAfterDiscount > 0
          ? totalPriceAfterDiscount
          : lactureModel.price,
    });

    // تحديث نقاط المعلم والمستخدم
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

    // حذف الكوبون بعد استخدامه
    const deleteDoc = await createCouponsModel.findByIdAndDelete(couponModel._id);

    // حفظ التغييرات
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
  } catch (error) {
    next(error);
  }
});
