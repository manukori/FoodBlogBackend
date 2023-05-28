const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors') //cross origin resourse sharing ------> npm i cors
let port = 4000;

//require user model
const User = require('./model/signup')
const post=require('./model/addpost')

const dburl = 'mongodb://localhost:27017/foodBlog'
mongoose.connect(dburl).then(() => {
    console.log("connected to database....!!!");
})


// MiddleWare---------->runs between req and res
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//Signin
app.post('/signin', (req, res) => {
    User.findOne({ email: req.body.email }).then((userData) => {
        if (userData) {
            if (req.body.password === userData.password) {
                res.send({ message: 'Login successfully' })
            } else {
                res.send({ message: ' Incorrect Password Login Failed' })
            }   
        } else {
            res.send({ message: 'User not found' })
        }
    })
})

//Sign Up
app.post('/signup', async (req, res) => {

    //findOne => used to check user Existence.
    User.findOne({ email: req.body.email }).then((userData) => {

        if (userData) {

            res.send({ message: "user already exists" })

        } else {
            let userData = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            userData.save().then(() => {
                res.send({ message: "User registered Successfully" })
            }).catch((err) => {
                res.send(err)
            })

            // userData.save(() => {
            //     if (err) {
            //         res.send(err)
            //     }
            //     else {
            //         res.send({ message: "User registered Successfully" })
                 //     }
            // })

        }
    })

})

// posts
app.get('/posts',async(req,res)=>{
    try{
        const posts=await post.find()
        res.json(posts)
    }catch(err){
        console.log(err);
    }
})

// singlepost
app.get('/posts/:id',async(req,res)=>{
    const {id}=req.params
    try {
        const posts=await post.findById(id)
        res.send(posts)
    } catch (error) {
        res.send(error)
    }
})

// addpost
app.post('/addpost',async(req,res)=>{
    let postdata=new post({
        title:req.body.title,
        image:req.body.image,
        author:req.body.author,
        summary:req.body.summary,
        location:req.body.location
    })
    postdata.save().then(()=>{
        res.send({message:'post added successfully'})
    }).catch((err)=>{
        res.send({message:'error while adding post'})
    })
})


// get sign up no.of happy customers
app.get('/signup',async(req,res)=>{
    try {
        const posts=await User.find();
        res.json(posts)
    } catch (err) {
        console.log(err);
    }
}) 


app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})