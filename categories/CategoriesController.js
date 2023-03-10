const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('./Category')



router.get('/admin/categories/new',(req,res)=>{
    res.render('admin/categories/new')
});

router.post('/categories/save',(req,res)=>{
    let title = req.body.title;
    if(title != undefined){
        Category.create({
            title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect('/admin/categories/new')
        })
    }else{
        res.redirect('/admin/categories/new')

    }
});

router.get('/admin/categories',(req,res)=>{
    Category.findAll().then((categories)=>{
        res.render('admin/categories/index', {
            categories
        })
    })
})

router.post('/categories/delete',(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            })
        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
})
router.post('/categories/delete',(req,res)=>{
    let id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect('/admin/categories')
            })
        }else{
            res.redirect('/admin/categories')
        }
    }else{
        res.redirect('/admin/categories')
    }
})
router.get('/admin/categories/edit/:id',(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/categories')
    }
    Category.findByPk(id).then((category)=>{
        if(category != undefined){
            res.render('admin/categories/edit',{category})
        }else{
            res.redirect('/admin/categories')
        }
    }).catch(err=>{
        res.redirect('/admin/categories')
    })
})

router.post('/categories/update',(req,res)=>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({
        title,
        slug:slugify(title),
    },
    {
        where:{
            id
        }
    }).then(()=>{
        res.redirect('/admin/categories')
    })
})

module.exports = router;