exports.updateUserPoint = expressAsyncHandler(async (req, res, next) => {
    const updateDocById = await createUsersModel.findById(req.params.id);
    const userLogged = await createUsersModel.findById(req.user._id);
    if (updateDocById.role === "user" && req.user.role === "manager") {
      return Promise.reject(new Error("Sorry You Not Allowed To Update Points"));
    }
    if (req.user.role === "manager" && req.user.point < req.body.point) {
      return Promise.reject(
        new Error(`Sorry Your Points ${req.user.point} > ${req.body.point}`)
      );
    }
    if (req.user.role === "admin" && req.user.point < req.body.point) {
      return Promise.reject(
        new Error(`Sorry Your Points ${req.user.point} > ${req.body.point}`)
      );
    }
    if (!updateDocById)
      next(
        new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
      );
      userLogged.point = +req.user.point - +req.body.point;
    console.log(userLogged.point);
    const totalPoint = +req.body.point + +updateDocById.point;
    updateDocById.point = totalPoint;
    await userLogged.history.push({
      from:userLogged.email,
      to: updateDocById.email,
      point: req.body.point,
      history: Date.now(),
    });
    await updateDocById.history.push({
      from: userLogged.email,
      to: updateDocById.email,
      point: req.body.point,
      history: Date.now(),
    });
  
    await userLogged.save();
    await updateDocById.save();
    res.status(200).json({ data: updateDocById });
  });