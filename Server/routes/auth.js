const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JSONWEBTOKEN_KEY, SENDGRID_KEY, EMAIL_URL} = require('../config/keys');
const authMiddleware = require('../middleware/auth')
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport')

const transport = nodemailer.createTransport(sendGridTransport({
    auth:{
        api_key:SENDGRID_KEY
    }
}))

const router = express.Router();

router.post('/signup', async (req,res)=>{
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        return res.status(400).send({error:'Please provide all the fields'})
    }

    const savedUser = await User.findOne({email})

    if(savedUser){
        return res.status(400).send({error:'Email already exists'})
    }

    const hashPassword = await bcrypt.hash(password, 8)

    const user = new User({
        name,
        email,
        password: hashPassword,
        pic
    })

    transport.sendMail({
        to:user.email,
        from:'arnabkundu.ary96@gmail.com',
        subject: 'Instagram-Sign-Up Successfull',
        html: '<h1>Welcome to Instagram</h1>'
    }).then(()=>{
        console.log('Mail sent')
    })

    await user.save();
    res.send({message: 'SignUp Successfull!!'})
})

router.post('/signin', async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).send({error:'Please provide email and password'})
    }

    try{
        const user = await User.findOne({email});

        console.log(user)
        if(!user){
            return res.status(400).send({error:'Invalid email or password'})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            return res.status(400).send({error:'Invalid email or password'})
        }

        const token = jwt.sign({_id: user._id}, JSONWEBTOKEN_KEY)

        // res.send({message:'Successfully signed in!'})
        // const {_id, name, email} = user;

        res.send({user:{
            _id:user._id,
            email:user.email,
            name:user.name,
            pic:user.pic,
            followers:user.followers,
            following:user.following
        }, token})

    }catch(err){
        console.log(err)
    }
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err, buffer)=>{
        if(err){
            console.log(err)
        }

        const token = buffer.toString('hex');
        User.findOne({email:req.body.email})
        .then(user => {
            if(!user){
                res.status(404).send({error:'User with this email doesn\'t exist'})
            }

            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;

            user.save()
            .then(result => {

                transport.sendMail({
                    to:user.email,
                    from:'arnabkundu.ary96@gmail.com',
                    subject: 'Instagram Password Reset',
                    html: `
                    <p>You have requested for a password reset</p>
                    <h5>Click on this <a href='${EMAIL_URL}/reset/${token}'>Link</a> to reset</h5>
                    `
                }).then(()=>{
                    console.log('Reset Password Mail sent')
                })

                res.send({message:'Check you Email'})
            })
        })
    })
})

router.post('/update-password', async (req, res)=> {
    try {

        const newPassword = req.body.password
        const sentToken = req.body.token

        const user = await User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})

        if(!user){
            res.status(404).send({error:'Session Expired !! Please try again'})
        }

        const hashPassword  = await bcrypt.hash(newPassword,8);

        user.password = hashPassword
        user.resetToken = undefined
        user.expireToken = undefined

        await user.save()

        res.send({message:'Password Updated !'})
        
    } catch (error) {
        res.status(404).send({error})
    }
})

module.exports = router;