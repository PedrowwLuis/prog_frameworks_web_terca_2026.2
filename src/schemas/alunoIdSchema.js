const z = require("zod");

// Valida que o id é numérico e converte para Number
const alunoIdSchema = z.object({
    id: z
        .string()
        .trim()
        .regex(/^\d+$/, "ID deve ser numérico")
        .transform(Number)
});

module.exports = alunoIdSchema;