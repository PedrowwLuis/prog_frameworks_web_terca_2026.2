const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");
const EmailDuplicadoError = require("../errors/EmailDuplicadoError");

class AlunoService{

    async findMany(page, pageSize, orderBy, order){
        // Campos de permissão de ordenação
        const camposOrdenaveis = ["id", "nome", "email", "createdAt", "updatedAt"];
        const campo = camposOrdenaveis.includes(orderBy) ? orderBy : "id";

        // Direção padrão: asc
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

    async findById(id){
        //SELECT * FROM alunos WHERE id = ?
        const aluno = await prisma.aluno.findUnique({
            where: { id }
        });

        if(!aluno){
            throw new AlunoNaoEncontradoError();
        }

        return aluno;
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

    async update(id, dados){
        const {nome, email} = dados || {};

        // Dados inválidos: nenhum campo para atualizar
        if(!nome && !email){
            throw new AlunoInvalidoError("Informe ao menos um campo (nome e/ou email) para atualizar.");
        }

        // Verifica se o aluno existe
        await this.findById(id);

        try{
            //UPDATE alunos SET ... WHERE id = ?
            const alunoAtualizado = await prisma.aluno.update({
                where: { id },
                data: {
                    ...(nome && { nome }),
                    ...(email && { email })
                }
            });

            return alunoAtualizado;
        }catch(e){
            // Email duplicado (erro P2002 do Prisma)
            if(e.code === "P2002"){
                throw new EmailDuplicadoError();
            }
            throw e;
        }
    }
}

module.exports = new AlunoService();