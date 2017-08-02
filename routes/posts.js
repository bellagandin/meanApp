const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const config = require('../config/database');


// Create Post
router.post('/createPost', (req, res, next) => {

    let newPost = new Post({
        time: req.body.time,
        recipe_title: req.body.recipe_title,
        category: req.body.category,
        co_author: req.body.co_author,
        ingredients:req.body.ingredients,
        description: req.body.description,
        amount_of_likes: 0,
        amount_of_dislike: 0,
        comments:[]
    });
    console.log("newPost",newPost);
    Post.addPost( newPost, (err, post) => {//callback
        if(err){
            res.json({success: false, msg:"1 " + err});
        } else {
            let userId = req.body.user_id;
            User.getUserById(userId, (err, user) => {// added post id to list of post of user
                if(err){
                    res.json({success: false, msg:"2 " + err});
                } else {
                    if(user!=null) {
                        User.addPost(user, newPost,(err, post) => {
                            if(err){
                                res.json({success: false, msg:"1 " + err});
                            } else {
                                res.json({success: true, msg:newPost});
                            }
                        });
                    }
                }
            });
        }
    });
});

// Update Post
router.post('/updatePost', (req, res) => {
    const post_id = req.body._id;
    Post.getPostById(post_id, (err, post) => {
        if (err) throw err;
        console.log(post_id,post);
        if (!post) {
            return res.json({success: false, msg: 'Post not found'});
        }
        // post.time= req.body.time;
        // post.recipe_title= req.body.recipe_title;
        // post.category = req.body.category;
        // post.co_author = req.body.co_author;
        // post.ingredients = req.body.ingredients;
        // post.description = req.body.description;
        // post.amount_of_likes = req.body.amount_of_likes;
        // post.amount_of_dislike = req.body.amount_of_dislike;
        // post.comments = req.body.comments;

        Post.updatePost(post, req.body, (err, post) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            } else {
                res.json({success: true, msg: post});
            }

        });
    });
});

module.exports = router;
