const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const factory = require("./FactoryHandler");
const createUsersModel = require("../modules/createUsers");
const ApiError = require("../Resuble/ApiErrors");

exports.uploadImage = UploadSingleImage("imageProfile");
exports.resizeImageUsers = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    const imageProfileName = `imageProfile-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${imageProfileName}`);
    req.body.imageProfile = imageProfileName;
  }

  next();
});

exports.createUsers = factory.createOne(createUsersModel);
exports.getUsers = factory.getAll(createUsersModel);
exports.getUser = factory.getOne(createUsersModel);
exports.updateUser = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.name,
      email: req.body.email,
      imageProfile: req.body.imageProfile,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status,
      passwordDB: req.body.passwordDB,
    },
    {
      new: true,
    }
  );
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
    );
  res.status(200).json({ data: updateDocById });
});
exports.deleteUser = factory.deleteOne(createUsersModel);

exports.updatePassword = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordTimeUpdate: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update Password From ID :${req.params.id}`, 404)
    );
  res.status(200).json({ data: updateDocById });
});
exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordTimeUpdate: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });
  res.status(200).json({ data: user, token });
});
exports.updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  const updatedUser = await createUsersModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
      imageProfile: req.body.imageProfile,
    },
    { new: true }
  );

  res.status(200).json({ data: updatedUser });
});
exports.deleteLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  await createUsersModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});

exports.createpasswordDashboard = expressAsyncHandler(
  async (req, res, next) => {
    const user = await createUsersModel.findOne({ email: req.user.email });
    if (!user) {
      return next(new ApiError(`This Email ${req.body.email} Not Exist `));
    }
    if (user.role === "user") {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    user.passwordDB = await bcrypt.hash(req.body.passwordDB, 12);
    await user.save();
    res
      .status(200)
      .json({ status: "success", massage: "Password Created successfully" });
  }
);
exports.updatePasswordDashboard = expressAsyncHandler(
  async (req, res, next) => {
    const updatepasswordDashboardById =
      await createUsersModel.findByIdAndUpdate(
        req.params.id,
        {
          passwordDB: await bcrypt.hash(req.body.passwordDB, 12),
        },
        {
          new: true,
        }
      );
    if (!updatepasswordDashboardById)
      next(
        new ApiError(
          `Sorry Can't Update Password From ID :${req.params.id}`,
          404
        )
      );
    res.status(200).json({ data: updatepasswordDashboardById });
  }
);
exports.updateLoggedUserPasswordDashboard = expressAsyncHandler(
  async (req, res) => {
    const user = await createUsersModel.findByIdAndUpdate(
      req.user._id,
      {
        passwordDB: await bcrypt.hash(req.body.passwordDB, 12),
      },
      {
        new: true,
      }
    );
    res.status(200).json({ data: user });
  }
);
exports.LoginDashboard = expressAsyncHandler(async (req, res, next) => {
  const user = await createUsersModel.findOne({
    email: req.user.email,
  });
  if (!user.passwordDB) {
    return next(new ApiError(`This Email:${user.email} Not Created password`));
  }
  if (!user || !(await bcrypt.compare(req.body.passwordDB, user.passwordDB))) {
    return next(new ApiError("InCorrect password Or Email"));
  }

  res.status(200).json({ data: user });
});
exports.updateUserRole = expressAsyncHandler(async (req, res, next) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User ${req.params.id} Not Found`));
  }

  res.status(200).json({ data: user });
});
exports.updateUserStatus = expressAsyncHandler(async (req, res, next) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError(`User ${req.params.id} Not Found`));
  }

  res.status(200).json({ data: user });
});
