const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');
const config = require('../config/database');

router.get('/', (req, res) => {
    res.send('Hello');
});

// Create Post
router.post('/createPost', (req, res, next) => {

    let newPost = new Post({
        time: req.body.time,
        recipe_title: req.body.recipe_title,
        category: req.body.category,
        co_author: req.body.co_author,
        ingredients:req.body.ingredients,
        description: req.body.description,//TODO: deal with img
        amount_of_likes: 0,
        amount_of_dislike: 0,
        comments:[]
    });

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
                                res.json({success: true, msg:user});
                            }
                        });
                    }
                }
            });
        }
    });
});


module.exports = router;
