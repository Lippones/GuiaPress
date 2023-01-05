const express = require('express');
const router = express.Router();
const User = require('./Users')
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

router.get('/admin/users',(req,res)=>{
    User.findAll().then((users)=>{
        res.render('admin/users/index.ejs',{users})
    })
})
router.get('/admin/users/create',(req,res)=>{
    res.render('admin/users/create.ejs')
})
router.post('/users/create',(req,res)=>{
    const {email, password, userName} = req.body

    User.findOne({
        where:{
            [Op.or]:[
                {
                    email
                },
                {
                    userName
                }
            ]
        }
    }).then((user)=>{
        if(user ==undefined){
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password,salt)
            User.create({
                userName,
                email,
                password:hash
            }).then(()=>{
                res.redirect('/')
            }).catch(err=>{
                res.redirect('/')
            })
        }else{
            res.redirect('/admin/users/create')
        }
    })

    
})
router.post('/users/delete',(req,res)=>{
    const {id} = req.body
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where:{
                    id
                }
            }).then(()=>{
                res.redirect('/admin/users')
            })
        }else{
            res.redirect('/admin/users')
        }
    }else{
        res.redirect('/admin/users')

    }
})
router.get('/admin/users/edit/:id',(req,res)=>{
    let id = req.params.id;
    if(isNaN(id)){
        res.redirect('/admin/users')
    }
    User.findByPk(id).then((users)=>{
        if(users != undefined){
            res.render('admin/users/edit',{users})
        }else{
            res.redirect('/admin/users')
        }
    }).catch(err=>{
        res.redirect('/admin/users')
    })
})

router.post('/users/update',(req,res)=>{
    const {email, password, userName, oldPassword, id} = req.body
    User.findOne({
        where:{
            [Op.or]:[
               id
            ]
        }
    }).then((user)=>{
        if(user !=undefined){
            bcrypt.compare(oldPassword,user.password, (err,result)=>{
                if(result){
                    const salt = bcrypt.genSaltSync(10)
                    const hash = bcrypt.hashSync(password,salt)
                    User.update({
                    userName,
                    email,
                    password:hash
                    },
                    {
                        where:{
                            id
                        }
                    }).then(()=>{
                        res.redirect('/admin/users')
                    }).catch(err=>{
                        res.redirect('/admin/users')
                    })
                }else{
                    res.render('admin/users/passowordRedirect')
                   
                }
            })
        }else{
            res.redirect('/admin/users')
        }
    })
})

router.get("/login", (req,res)=>{
    res.render("admin/users/login")
})
router.post("/authenticate", (req,res)=>{
    const {login, password} = req.body

    User.findOne({
        where:{
            [Op.or]:[
                {
                    email:login
                },{
                    userName:login
                }
            ]
        }
    }).then(user=>{
        if(user!=undefined){
            const result = bcrypt.compareSync(password, user.password)
            if(result){
                req.session.user = {
                    id:user.id,
                    userName:user.userName,
                    email:user.email
                }
                res.redirect('/admin/articles')
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })
})
router.get('/logout',(req,res)=>{
    req.session.user = undefined;
    res.redirect('/')
})

module.exports = router
