const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        // Campos pelos quais é permitido ordenar (evita passar um campo
        // arbitrário/inexistente direto para o Prisma).
        const camposOrdenaveis = ["id", "nome", "email", "createdAt", "updatedAt"];
        const campo = camposOrdenaveis.includes(orderBy) ? orderBy : "id";

        // Se vier algo diferente de "asc"/"desc", cai no padrão "asc"
        // em vez de quebrar a aplicação.
        const direcao = (order === "asc" || order === "desc") ? order : "asc";

        //SELECT * FROM alunos ORDER BY campo direcao LIMIT ... OFFSET ...
        const [alunos, total] = await Promise.all([
            prisma.aluno.findMany({
                skip: (page-1)*pageSize,
                take: Number(pageSize),
                orderBy: { [campo]: direcao }
            }),
            //SELECT COUNT(*) FROM alunos
            prisma.aluno.count()
        ]);

        return { alunos, total };
    }

    async create(aluno){
        const {nome, email} = aluno;
        if(!nome || !email){
            throw new AlunoInvalidoError();
        }
        //create = insert
        //update = update
        //delete = delete
        //findMany = select * from
        const novoAluno = await prisma.aluno.create({data:aluno});

        return novoAluno;
    }
}

module.exports = new AlunoService();