const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser")
const db = require("./models/db")
const Aluno = require("./models/Aluno")


app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Rotas

app.get("/style", function(req, res){
    res.sendFile(__dirname + '/css/style.css');
});

/*app.get('/', function(req, res){
    res.render('login');
});*/

app.get('/aluno', function(req, res){
    //Listar todos os alunos
    Aluno.findAll().then(function(alunos){
        res.render('aluno', {alunos: alunos});
    });
    
});

app.get('/cad-aluno', function(req, res){
    res.render('cad-aluno');
});

app.post('/add-aluno', function(req, res){
    Aluno.create({
        nome_aluno: req.body.nome_aluno,
        idade_aluno: req.body.idade_aluno,
        email_aluno: req.body.email_aluno,
        senha_aluno: req.body.senha_aluno,
        responsavel_aluno: req.body.responsavel_aluno,
        cuidador_aluno: req.body.cuidador_aluno,
        psicologo_aluno: req.body.psicologo_aluno

    }).then(function(){
        res.redirect('/Aluno')
        //res.send("Pagamento cadastro com sucesso!")
    }).catch(function(erro){
        res.send("Erro: não foi possivel cadastrar Aluno" + erro)
    })
    //res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
});



app.listen(8081);