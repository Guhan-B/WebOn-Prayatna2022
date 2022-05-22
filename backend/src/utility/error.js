class ServerError extends Error {
    constructor(message, status, code, errors = []) {
        super(message);
        this.status = status;
        this.code = code;
        this.errors = errors;
    }
}

exports.ServerError = ServerError;