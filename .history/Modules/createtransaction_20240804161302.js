const mongoose = require("mongoose");

const createTransaction = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
   
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Users", "Teachers"], // النماذج الممكنة
    },
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

async function populateTransaction(transaction) {
  const { sender, senderModel } = transaction;
  let model;

  switch (senderModel) {
    case "Users":
      model = User;
      break;
    case "Teachers":
      model = Teacher;
      break;
    // أضف حالات أخرى مثل Admin و Manager
    default:
      throw new Error("Unknown sender model");
  }

  return model.findById(sender).select("name").exec();
}

const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);
createTransactionModel.find({})
  .then(async (transactions) => {
    for (let createTransactionModel of transactions) {
      const sender = await populateTransaction(createTransactionModel);
      console.log('Sender Name:', sender ? sender.name : 'Not found');
    }
  })
  .catch(err => console.error(err));
module.exports = createTransactionModel;
