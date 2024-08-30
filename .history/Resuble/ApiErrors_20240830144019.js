class ApiError extends Error {
    constructor(msg , statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
        this.Operations = true
    }
}

module.exports = ApiError