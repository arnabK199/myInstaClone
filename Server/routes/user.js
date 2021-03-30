const express = require('express');
const Post = require('../models/post');
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id:req.params.id}).select('-password')
        if(! user){
            throw new Error('Please Authenticate')
        }

        const post = await Post.find({postedBy:req.params.id}).populate('postedBy', '_id name')
        if(! post){
            throw new Error('No post found for the user')
        }

        res.send({user, post})
    } catch (error) {
        res.status(404).send({error})
    }
})

router.put('/follow', authMiddleware ,(req, res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new: true
    },(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $push:{following: req.body.followId}
        },{
            new: true
        })
        .select('-password')
        .then(result=>{
            res.send(result)
        }).catch(err=>{
            res.status(404).send({err})
        })
    })
})

router.put('/unfollow', authMiddleware ,(req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new: true
    },(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:{following: req.body.unfollowId}
        },{
            new: true
        })
        .select('-password')
        .then(result=>{
            res.send(result)
        }).catch(err=>{
            res.status(404).send({err})
        })
    })
})

router.put('/updateprofilepic', authMiddleware, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic: req.body.pic}
    },{
        new:true
    },((err,result)=>{
        if(err){
            res.status(404).send({err})
        }
        res.send(result)
    }))
})

router.post('/search-user', (req, res)=>{
    const userPattern = new RegExp('^'+ req.body.query)
    User.find({email:{$regex:userPattern}})
    .select('_id email name')
    .then(user=>{
        res.send({user})
    }).catch(err=>{
        res.send({error:err})
    })
})

module.exports = router;