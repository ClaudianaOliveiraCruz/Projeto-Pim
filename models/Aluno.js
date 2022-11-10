const db = require('./db')

const Aluno = db.sequelize.define('aluno', {
    nome_aluno: {
        type: db.Sequelize.STRING
    },
    idade_aluno: {
        type: db.Sequelize.DOUBLE
    },
    email_aluno: {
        type: db.Sequelize.STRING
    },
    senha_aluno: {
        type: db.Sequelize.STRING
    },
    responsavel_aluno: {
        type: db.Sequelize.STRING
    },
    cuidador_aluno: {
        type: db.Sequelize.STRING
    },
    psicologo_aluno: {
        type: db.Sequelize.STRING
    }

})

//Criar a tabela executar uma vez.
//Aluno.sync({force: true})

module.exports = Aluno