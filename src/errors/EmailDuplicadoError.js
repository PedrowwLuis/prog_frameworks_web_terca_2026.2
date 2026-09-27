const ApiError = require("./ApiError");

// Erro de email duplicado (email é @unique no schema)
class EmailDuplicadoError extends ApiError {
    constructor(message = "Este email já está cadastrado para outro aluno", statusCode = 409) {
        super(message, statusCode);
    }
}

module.exports = EmailDuplicadoError;