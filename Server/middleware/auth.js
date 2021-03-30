const { model } = require("../models/user")
const {JSONWEBTOKEN_KEY} = require('../config/keys');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const auth  = async (req, res, next)=> {

    try{
        console.log('inside Middleware')
        const { authorization } = req.headers;

        if(!authorization){
            req.status(401).send({error:'You must be logged in!!'})
        }

        const token = authorization.replace('Bearer ','');

        const decodedTokenData =  jwt.verify(token, JSONWEBTOKEN_KEY);
        const user = await User.findById({_id:decodedTokenData._id})

        if(!user){
            throw new Error
        }

        req.user = user;
        next();
        
    }catch(e){
        res.status(401).send({error: 'Please Authenticate !'})
    }
}

module.exports = auth;