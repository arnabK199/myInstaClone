const express = require('express');
const Post = require('../models/post');
const authMiddleware = require('../middleware/auth')

const router = express.Router();

router.post('/createpost', authMiddleware, async (req, res)=>{
    
    try{
        const {title, body , photo} = req.body;
        console.log(title)
        console.log(body)
        console.log(photo)
        if(!title || !body || !photo){
            return res.status(400).send({error:'Please provide all the values'})
        }

        req.user.password = undefined;

        const post = new Post({
            title,
            body,
            photo,
            postedBy:req.user
        })

        await post.save();
        res.send(post)
    }catch(e){
        console.log(e)
    }

})

router.get('/allposts',authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({})
        .sort('-createdAt')
        .populate('postedBy','_id name pic')
        .populate('comments.commentedBy', '_id name');

        res.send(posts)
    } catch (error) {
        res.status(404).send(error)
    }
    
})


router.get('/getsubpost',authMiddleware, async (req, res) => {
    try {
        // If postedBy in following
        const posts = await Post.find({postedBy:{$in:req.user.following}})
        .sort('-createdAt')
        .populate('postedBy','_id name')
        .populate('comments.commentedBy', '_id name');

        res.send(posts)
    } catch (error) {
        res.status(404).send(error)
    }
    
})

router.get('/myposts', authMiddleware, async(req, res)=> {

    try {
        const posts = await Post.find({postedBy: req.user._id}).populate('postedBy', '_id name')
        res.send(posts)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.put('/like', authMiddleware , async (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push: {likes: req.user._id}
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(500).send({error:err})
        }

        res.send(result)
    })
})

router.put('/unlike', authMiddleware , async (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull: {likes: req.user._id}
    },{
        new: true
    }).exec((err, result) => {
        if(err){
            return res.status(500).send({error:err})
        }

        res.send(result)
    })
})

router.put('/comment', authMiddleware , (req, res) => {
    const comment = {
        text: req.body.text,
        commentedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate('comments.commentedBy', '_id name')
    .exec((err, results) => {
        if(err){
            return res.status(500).send({error:err})
        }
        res.send(results)
    })
})

router.delete('/delete/:postId', authMiddleware , async (req, res) => {

    try {
        const post = await (await Post.findOne({_id: req.params.postId})).populate('postedBy', '_id name')

        if(!post){
            throw new Error('Please provide credentials')
        }

        if(post.postedBy._id.toString() === req.user._id.toString()){
            await post.remove();
            res.send(post)
        }

    } catch (error) {
        res.status(404).send({error})
    }
})

router.post('/comment/:id', async (req,res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
        .populate('postedBy', '_id name')
        .populate('comments.commentedBy', '_id name');
        
        if(!post){
            throw new Error('Please provide credentials')
        }
        console.log(post)
        const newPostComments  = post.comments.filter(comment => {
            console.log('Line - 133 '+ comment._id.toString())
            console.log('Line - 134 '+ req.body)
            return comment._id.toString() !== req.body.commentId.toString()
        })
        console.log('Line - 137 -hello')
        post.comments = newPostComments
        console.log('Line - 139 -hello')
        await post.save()

        res.send(post)
    } catch (error) {
        
    }
})

module.exports = router;