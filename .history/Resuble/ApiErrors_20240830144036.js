class ApiError extends Error {
    constructor(msg , statusCode){
        super(msg)
        this.statusCode = statusCode
        this.msg = statusCode
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
        this.Operations = true
    }
}

module.exports = ApiError