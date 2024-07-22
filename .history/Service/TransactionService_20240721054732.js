const expressAsyncHandler = require("express-async-handler");
const createUsersModel = require("../Modules/createUsers");
const createTransactionModel = require("../Modules/createtransaction");
const { ObjectId } = require("mongodb");
exports.updatePoint = expressAsyncHandler(async (req, res, next) => {
  const { receiver, points } = req.body;
  const sender = await createUsersModel.findById(req.user._id);
  const receive = await createUsersModel.findById(receiver);
  if (!receive || (receive.role !== "admin" && sender.role === "manager")) {
    return Promise.reject(
      new Error("Sorry Manager Not Allowed To Send Points To Users")
    );
  }
  if (!sender || (sender.role !== "admin" && receive.role === "user")) {
    return Promise.reject(
      new Error("Sorry Manager Not Allowed To Send Points To Users")
    );
  }
  admin.point += points;
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
