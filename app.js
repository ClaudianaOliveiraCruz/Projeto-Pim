const express = require("express");
const app = express();
const session = require('express-session');
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const db = require("./models/db")
const Aluno = require("./models/Aluno")
const mysql = require('mysql2')


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

//Rotas CSS

app.get("/style", function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});
app.get("/menu", function(req, res){
    res.sendFile(__dirname + '/css/menu.css');
});

//Rotas APP

app.get('/', function(req, res){
    res.render('login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/relatorio', function(req, res){
    res.render('relatorio');
});

app.post('/funcao', function(req, res){

    const cadastrar = req.body.cadastrar
    const login = req.body.login

    if(cadastrar){
        res.redirect('cad-aluno');
    }

    if(login){
        
    const email_aluno = req.body.email_aluno;
	const senha_aluno = req.body.senha_aluno;

	if (email_aluno && senha_aluno) {
		conn.query('SELECT * FROM alunos WHERE email_aluno = ? AND senha_aluno = ?', [email_aluno, senha_aluno], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.email_aluno = email_aluno;
				res.render('aluno', {lista:results});
                //console.log(results)

                
			} else {

				
                res.render('login');
                
			}			
		});
	}

    } 

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
                        //console.log(results)
        
                        
                    }
                    
                });
            }


    

    
});

}

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
