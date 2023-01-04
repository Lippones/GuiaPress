//Importações
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');


// Sessions
app.use(session({
    secret:'pasteldefrango',
    cookie:{
        maxAge: 60000 * 60
    }
}))


const ArticlesController = require('./articles/ArticlesController');
const UsersController = require('./users/UsersController');
const CategoriesController = require('./categories/CategoriesController');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const Users = require('./users/Users');

//Configurações
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use("/",CategoriesController)
app.use("/",ArticlesController)
app.use('/',UsersController)



// DataBase
connection
    .authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados!');
    })
    .catch((err)=>{
        console.log(err);
    })

//Rotas

app.get('/session',(req,res)=>{
    req.session.teste = "testando as rota"
    res.send("criada")
})
app.get('/leitura',(req,res)=>{
        res.json(req.session)
})

app.get('/', (req, res) => {
    Article.findAll({
        order:[['id','DESC']], limit:4
    }).then((articles)=>{
        Category.findAll().then(categories=>{
            res.render('index', {articles, categories})
        })
    })
});

app.get('/:slug',(req,res)=>{
    const { slug } = req.params;
    Article.findOne({
        where: {
            slug:slug
        }
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render('article', {article, categories})
            })
        }else{
            res.redirect('/');
        }
    }).catch(err=>{
        console.log(err)
        res.redirect('/')
    })
})  

app.get('/category/:slug',(req,res)=>{
    const {slug} = req.params
    Category.findOne({
        where:{
            slug
        },
        include:[{model:Article}]
    }).then(category=>{
        if(category!= undefined){
            Category.findAll().then(categories=>{
                res.render('index', {articles: category.articles, categories})
            })
        }else{
            res.redirect('/')

        }
    }).catch(err=>{
        res.redirect('/')
    })
})

app.listen(3333, ()=>{
 console.log("Server running in port 3333! 🚀");
});