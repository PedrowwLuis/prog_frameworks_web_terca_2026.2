const alunoIdSchema = require("../schemas/alunoIdSchema");

const validarAlunoId = (request, response, next) => {
    const result = alunoIdSchema.safeParse(request.params);

    if (!result.success) {
        return response.status(400).json({ message: "ID deve ser numérico" });
    }

    request.params = result.data;
    next();
}

module.exports = validarAlunoId;