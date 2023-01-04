const express = require('express');
const router = express.Router();
const Category = require('../categories/Category.js');
const Article = require('../articles/Article.js');
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth.js')

router.get('/admin/articles',adminAuth, (req,res)=>{
    Article.findAll({
        include:[{model:Category}]
    }).then((articles)=>{
        res.render('admin/articles/index',{articles})
    })
});

router.get('/admin/articles/new',adminAuth,(req,res)=>{
    Category.findAll().then(categories =>{
        res.render('admin/articles/new.ejs',{categories:categories})
    })
});

router.post('/articles/save',adminAuth,(req,res)=>{
    const {title, body, category} = req.body;

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete',adminAuth,(req,res)=>{
    const {id} = req.body
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect('/admin/articles')
            })
        }else{
            res.redirect('/admin/articles')
        }
    }else{
        res.redirect('/admin/articles')

    }
})
router.get('/admin/articles/edit/:id',adminAuth,(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/articles')
    }
    Article.findByPk(id).then((article)=>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render('admin/articles/edit',{article, categories})
            })
        }else{
            res.redirect('/admin/articles')
        }
    }).catch(err=>{
        res.redirect('/admin/articles')
    })
})

router.post('/articles/update',adminAuth,(req,res)=>{
    const {id,title,body,category} = req.body

    Article.update({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    },
    {
        where:{
            id
        }
    }).then(()=>{
        res.redirect('/admin/articles')
    })
})

router.get('/articles/page/:page',(req,res)=>{
    const {page} = req.params
    let offset = 0

    if(isNaN(page) || page ==1 ){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * 4

    }
    Article.findAndCountAll({
        limit:4,
        offset:offset,
        order:[['id','DESC']]
    }).then((articles)=>{
        let next
        if(offset + 4 >= articles.count){
            next =false
        }else{
            next= true
        }
        var result = {
            page:parseInt(page),
            next: next,
            articles : articles
        }
        Category.findAll().then(categories=>{
            res.render('admin/articles/page',{result,categories})
        })
    })
})

module.exports = router;