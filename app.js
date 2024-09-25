const express = require("express");
const app = express();
const handlebars = require("express-handlebars").engine;
const bodyParser = require("body-parser");
const post = require("./models/post");

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para cadastro
app.get("/", function (req, res) {
    res.render("cadastro");
});

// Rota para cadastrar
app.post("/cadastrar", function (req, res) {
    post.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado,
        telefone: req.body.telefone,
    })
    .then(function () {
        res.redirect("/");
    })
    .catch(function (erro) {
        res.send("Erro: " + erro);
    });
});

// Rota para consulta
app.get("/consulta", function (req, res) {
    post.findAll()
        .then(function (posts) {
            const clientes = posts.map(post => post.get({ plain: true }));
            res.render("consulta", { clientes: clientes });
            console.log(clientes);
        })
        .catch(function (erro) {
            console.log("Erro ao carregar dados do banco: " + erro);
        });
});

// Rota para editar
app.get("/editar/:id", function (req, res) {
    post.findByPk(req.params.id)
        .then(function (post) {
            if (post) {
                res.render("editar", { 
                    id: post.id,
                    nome: post.nome,
                    endereco: post.endereco,
                    bairro: post.bairro,
                    cep: post.cep,
                    cidade: post.cidade,
                    estado: post.estado,
                    telefone: post.telefone
                });
            } else {
                res.send("Post não encontrado");
            }
        })
        .catch(function (erro) {
            console.log("Erro ao carregar dados do banco: " + erro);
        });
});

// Rota para atualizar
app.post("/atualizar", function (req, res) {
    post.update({
        nome: req.body.nome,
        endereco: req.body.endereco,
        bairro: req.body.bairro,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado,
        telefone: req.body.telefone,
    }, { where: { id: req.body.id } })
    .then(function ([rowsUpdate]) {
        if (rowsUpdate === 0) {
            // Verifica se nenhum registro foi atualizado
            return res.send("Nenhum registro atualizado");
        }
        res.redirect("/consulta");
    })
    .catch(function (erro) {
        res.send("Erro ao atualizar: " + erro);
    });
});


// Rota para excluir
app.get("/excluir/:id", function (req, res) {
    post.destroy({ where: { id: req.params.id } })
        .then(function () {
            res.redirect("/consulta");
        })
        .catch(function (erro) {
            res.send("Erro ao excluir: " + erro);
        });
});

// Inicializando o servidor
app.listen(8081, function () {
    console.log("Servidor Ativo!");
});
