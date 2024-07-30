const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");
const createTransactionModel = require("../Modules/createtransaction");
const factory = require("./FactoryHandler");
const { ObjectId } = require("mongodb");
exports.updateAdminPoint = expressAsyncHandler(async (req, res, next) => {
  const { receiver, points } = req.body;
  const sender = await createUsersModel.findById(req.user._id);
  const receive = await createUsersModel.findById(receiver);
  if (!receive || receive.role !== "admin") {
    return Promise.reject(
      new Error("Sorry Manager Not Allowed To Send Points To Users")
    );
  }
  receive.point += points;
  await sender.save();
  await receive.save();

  const transaction = new createTransactionModel({
    sender: req.user._id,
    receiver: receive._id,
    pointsSent: points,
  });

  await transaction.save();
  res.status(200).send({ status: "Success", data: transaction });
});
exports.updateUserPoint = expressAsyncHandler(async (req, res, next) => {
  const { receiver, points } = req.body;
  const sender = await createUsersModel.findById(req.user._id);
  const receive = await createUsersModel.findById(receiver);
  if (!receive || receive.role !== "user") {
    return Promise.reject(
      new Error("Sorry Admin Not Allowed To Send Points To Users")
    );
  }
  if (sender.point < points) {
    return res.status(400).send({ status: "Error", data: `Sorry Points less Than ${sender.point}` });
  }
  receive.point += +points;
  sender.point -= +points;
  await sender.save();
  await receive.save();

  const transaction = new createTransactionModel({
    sender: req.user._id,
    receiver: receive._id,
    pointsSent: points,
  });

  await transaction.save();
  res.status(200).send({ status: "Success", data: transaction });
});

exports.getTransactionsDate = expressAsyncHandler(async (req, res, next) => {
  const { receiver, month, year } = req.params;
  const transactions = await createTransactionModel.find({
    receiver: new ObjectId(receiver),
    date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) },
  });

  const totalPoints = await createTransactionModel.aggregate([
    {
      $match: {
        receiver: receiver,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      },
    },
    { $group: { _id: null, total: { $sum: "$pointsSent" } } },
  ]);

  res.send({
    transactions,
    totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
  });
});
exports.getTransactionsYear = expressAsyncHandler(async (req, res, next) => {
  const { receiver, year } = req.params;
  const transactions = await createTransactionModel.find({
    receiver: receiver,
    date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) },
  });

  const totalPoints = await createTransactionModel.aggregate([
    {
      $match: {
        receiver: new ObjectId(receiver),
        date: { $gte: new Date(year, 0, 1), $lt: new Date(year, 12, 31) },
      },
    },
    { $group: { _id: null, total: { $sum: "$pointsSent" } } },
  ]);

  res.send({
    transactions,
    totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
  });
});
exports.getAllTransactionsMonth = expressAsyncHandler(
  async (req, res, next) => {
    const { month, year } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const transactions = await createTransactionModel.find({
      date: { $gte: startDate, $lt: endDate },
    });

    const totalPoints = await createTransactionModel.aggregate([
      { $match: { date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: "$pointsSent" } } },
    ]);

    res.send({
      transactions,
      totalPoints: totalPoints.length > 0 ? totalPoints[0].total : 0,
    });
  }
);
exports.getAllTransactions = factory.getAll(createTransactionModel);
exports.getOneTransaction = factory.getOne(createTransactionModel);
exports.getMyTransactions = expressAsyncHandler(async (req, res, next) => {
  const transactions = await createTransactionModel.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  });
  if (!transactions)
    next(new ApiError(`Sorry Can't get This ID From ID :${req.user._id}`, 404));
  res.status(200).json({ data: transactions, results: transactions.length });
});
