const express = require("express");
const app = express();
const session = require('express-session');
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const db = require("./models/db")
const Aluno = require("./models/Aluno")
const mysql = require('mysql2')
const pdf = require("html-pdf")
const fs = require("fs")

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



//CONECTAR BANCO DE DADOS
const conn = mysql.createConnection({
    host: 'localhost', 
    user: 'root', //USUARIO
    password: '', //SENHA
    database: 'pim' //NOME DO SEU BANCO
})

conn.connect(function(err){
    if(err){
        console.log(err);
    }
    console.log('conectado ao Mysql');

    app.listen(8081);

})

//Rotas CSS Relatorio e Imagens

app.get("/style", function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});
app.get("/menu", function(req, res){
    res.sendFile(__dirname + '/css/menu.css');
});
app.get("/relatoriopdf", function(req, res){
    res.sendFile(__dirname + '/RELATORIOPDF.pdf');
});

app.get("/logo1", function(req, res){
    res.sendFile(__dirname + '/img/Pim01.png');
});

app.get("/logo_apae", function(req, res){
    res.sendFile(__dirname + '/img/APAE CANINDÉ.jpeg');
});

app.get("/logo_caps", function(req, res){
    res.sendFile(__dirname + '/img/CAPS.png');
});

app.get("/logo_clinica", function(req, res){
    res.sendFile(__dirname + '/img/Dr Marina Laurenio.jpeg');
});


//Rotas APP
app.get('/APAE', function(req, res){
    res.render('APAE');
});

app.get('/CAPS', function(req, res){
    res.render('CAPS');
});

app.get('/dodo', function(req, res){
    res.render('dodo');
});

app.get('/', function(req, res){
    res.render('login');
});

app.get('/sobre', function(req, res){
    res.render('sobre');
});

app.get('/cuidador', function(req, res){
    res.render('cuidador');
});

app.get('/cuidador1', function(req, res){
    res.render('cuidador_1');
});

app.get('/pais', function(req, res){
    res.render('pais');
});

app.get('/caninde', function(req, res){
    res.render('caninde');
});

app.get('/publicos', function(req, res){
    res.render('publicos');
});

app.get('/privados', function(req, res){
    res.render('privados');
});

app.get('/clinica', function(req, res){
    res.render('clinica');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/funcao', function(req, res){

    const cadastrar = req.body.cadastrar
    const login = req.body.login

    if(cadastrar){
        res.redirect('cad-aluno');
    }

    if(login){

        
    email_aluno = req.body.email_aluno;
	senha_aluno = req.body.senha_aluno;

//LOGIN

	if (email_aluno && senha_aluno) {

		conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {  	
            

            if (results.length > 0) {

				req.session.loggedin = true;
				req.session.email_aluno = email_aluno;

                    res.render('aluno', {lista:results});
                
                
			} else {

                res.render('login');
                
			}	
            
            

		});
	}

    

    } 



});

app.get('/aluno', function(req, res){

    conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {  	
            

        if (results.length > 0) {

            req.session.loggedin = true;
            req.session.email_aluno = email_aluno;

                res.render('aluno', {lista:results});
            
            
        } else {

            res.render('login');
            
        }	
        
        

    });
    
});

app.get('/cad-aluno', function(req, res){
    res.render('cad-aluno');
});



app.post('/add-aluno', function(req, res){
    
    const cadastro = req.body.cadastro
    const login = req.body.login

if(login){
        
            res.render('login');
        
}

if(cadastro){

    const nome_aluno = req.body.nome_aluno
    const idade_aluno = req.body.idade_aluno
    const email_aluno = req.body.email_aluno
    const senha_aluno = req.body.senha_aluno
    const responsavel_aluno = req.body.responsavel_aluno
    const cuidador_aluno = req.body.cuidador_aluno
    const psicologo_aluno = req.body.psicologo_aluno



  //INSERINDO DADOS NA TABELA alunos 

    const query = `INSERT INTO alunos (nome_aluno, idade_aluno, email_aluno, senha_aluno, responsavel_aluno, cuidador_aluno, psicologo_aluno) 
    VALUES ('${nome_aluno}', '${idade_aluno}', '${email_aluno}', '${senha_aluno}', '${responsavel_aluno}', '${cuidador_aluno}', '${psicologo_aluno}' )`

    conn.query(query, function(err){
        if(err){
            console.log(err)
        }
    })

    res.render('cad-aluno');
    
}

    
    
});

app.post('/update-aluno', function(req, res){

    const deletar = req.body.deletar
    const atualizar = req.body.atualizar
    

    const id_aluno = req.body.id_aluno
    parseInt(id_aluno)
    const nome_aluno = req.body.nome_aluno
    const idade_aluno = req.body.idade_aluno
    const email_aluno = req.body.email_aluno
    const senha_aluno = req.body.senha_aluno
    const responsavel_aluno = req.body.responsavel_aluno
    const cuidador_aluno = req.body.cuidador_aluno
    const psicologo_aluno = req.body.psicologo_aluno

//ATUALIZAR CADASTRO ALUNO

if(atualizar){

    const query = `UPDATE alunos SET nome_aluno='${nome_aluno}', idade_aluno='${idade_aluno}', email_aluno='${email_aluno}', senha_aluno='${senha_aluno}',
        responsavel_aluno='${responsavel_aluno}', cuidador_aluno='${cuidador_aluno}', psicologo_aluno='${psicologo_aluno}' WHERE id_aluno= ${id_aluno}`			

    conn.query(query, function(err, data){

            if(err){
                console.log(err)
            }
    
            if (email_aluno && senha_aluno) {
                conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {
                    if (results.length > 0) {
                        req.session.loggedin = true;
                        req.session.email_aluno = email_aluno;
                    
                        res.render('aluno', {lista:results});
        
                        
                    }
                    
                });
            }


    

    
});

}

//DELETAR 

if(deletar){

    const query = `DELETE FROM alunos WHERE id_aluno= ${id_aluno}`	

    conn.query(query, function(err, data){

        if(err){
            console.log(err)
        }

        res.redirect('/');      

    });



}

});


app.get('/relatorio', function(req, res){
    conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {  	
            

        if (results.length > 0) {

            req.session.loggedin = true;
            req.session.email_aluno = email_aluno;

                res.render('relatorio', {lista:results});
            
            
        } else {

            res.render('login');
            
        }	
        
        

    });
});


app.post('/pdf', function(req, res){

    conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.email_aluno = email_aluno;
        
            res.render('relatorio', {lista:results});

            
        }
        
    });

    const gerar = req.body.gerar

    const nome_aluno = req.body.nome_aluno
    const data_aluno = req.body.data_aluno
    const cuidador_aluno = req.body.cuidador_aluno
    const emocional = req.body.emocional
    const relacionamento = req.body.relacionamento
    const psicomotor = req.body.psicomotor
    const escritafala = req.body.escritafala
    const percepcaoCuidador = req.body.percepcaoCuidador

    if(gerar){

        console.log(nome_aluno)

        const conteudo = `

            <h1 style = 'color: black'> Relatório</h1>
            <hr>

            <p style = 'font-size: 18px'>Nome do Aluno: <b>${nome_aluno}</b>            Data: <b>${data_aluno}</b></p>
            <p style = 'font-size: 18px'>Nome do Cuidador: <b>${cuidador_aluno}</b></p>
            <hr>

            <h3 style = 'font-size: 18px'>Emocional Afetivo da Criança:</h3>
            <p style = 'font-size: 18px'>${emocional}</p>

            <h3 style = 'font-size: 18px'>Relacionamentos Social da Criança:</h3>
            <p style = 'font-size: 18px'>${relacionamento}</p>

            <h3 style = 'font-size: 18px'>Psicomotor da Criança:</h3>
            <p style = 'font-size: 18px'>${psicomotor}</p>

            <h3 style = 'font-size: 18px'>Escrita e Fala da Criança:</h3>
            <p>${escritafala}</p>

            <h3 style = 'font-size: 18px'>Percepção do Cuidador da Criança:</h3>
            <p style = 'font-size: 18px'>${percepcaoCuidador}</p>


        `

        pdf.create(conteudo, {}).toFile("./RELATORIOPDF.pdf", (err, res) =>{

                if(err) {
                console.log("Ocorreu um erro")
                } else {
                console.log(res);
                

                }


    });

    


    }
    
});
