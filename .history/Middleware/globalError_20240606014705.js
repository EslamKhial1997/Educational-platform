const ApiErrorDev = (err, res) => {
   res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
  
};
const ApiErrorProduction = (err, res) => {
   res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  }); 
};
const globalError = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    ApiErrorDev(err, res);
  } else {
    ApiErrorProduction(err, res);
  }
};
module.exports = globalError;
