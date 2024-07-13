
const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");




exports.createClasses = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassModel);
exports.getClass = factory.getOne(createClassModel);


