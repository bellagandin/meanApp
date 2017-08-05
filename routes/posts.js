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
        main_img: req.body.main_img,
        ingredients: req.body.ingredients,
        description: req.body.description,
        instructions: req.body.instructions,
        likes: [],
        comments: [],
        id_generator: 0
    });
    console.log("newPost", newPost);
    Post.addPost(newPost, (err, post) => {//callback
        if (err) {
            res.json({success: false, msg: "1 " + err});
        } else {
            let userId = req.body.user_id;
            User.getUserById(userId, (err, user) => {// added post id to list of post of user
                if (err) {
                    res.json({success: false, msg: "2 " + err});
                } else {
                    if (user != null) {
                        User.addPost(user, newPost, (err, post) => {
                            if (err) {
                                res.json({success: false, msg: "1 " + err});
                            } else {
                                res.json({success: true, msg: newPost});
                            }
                        });
                    }
                }
            });
        }
    });
});

// Update Post
router.post('/editPost', (req, res) => {
    const post_id = req.body._id;
    Post.getPostById(post_id, (err, post) => {
        if (err) throw err;
        console.log(post_id, post);
        if (!post) {
            return res.json({success: false, msg: 'Post not found'});
        }

        Post.updatePost(post, req.body, (err, post) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            } else {
                res.json({success: true, msg: post});
            }

        });
    });
});


router.post("/removePost", (req, res) => {
    const post_id = req.body._id;
    const user_email = req.body.user_email;
    Post.removePost(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            // get object user
            User.getUserByEmail(user_email, (err, user) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    console.log("user",user);
                    User.removePost(user, post_id, (err, upd) => {
                        if (err) {
                            res.json({success: false, msg: err});
                        } else {
                            res.json({success: true, msg: upd});
                        }
                    });
                }
            });
           // res.json({success: true, msg: "hey"});
        }
    });
});


router.post("/addComment", (req, res) => {
    const post_id = req.body.post_id;
    Post.getPostById(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            let comment = {
                comment_id: post.id_generator,
                text: req.body.text_comment,
                author: req.body.user_email,
                likes: 0
            };
            Post.addCommentToPost(comment, post, (err, updatedPost) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    User.getUserByEmail(req.body.user_email, (err, user) => {
                        if (err) {
                            res.json({success: false, msg: err});
                        } else {


                            console.log(comment);
                            res.json({success: true, msg: comment});
                        }
                    });
                }
            });
        }
    });
});

router.post("/removeComment", (req, res) => {
    const post_id = req.body.post_id;
    const comment_id = req.body.comment_id;
    Post.getPostById(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            Post.removeCommentFromPost(comment_id, post, (err, post) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    res.json({success: true, msg: post});
                }

            });
        }
    });
});

router.post("/editComment", (req, res) => {

});

router.post("/likedPost", (req, res) => {
    const post_id = req.body.post_id;
    const user_email = req.body.user_email;
    //Get object post
    Post.getPostById(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            //get object user
            User.getUserByEmail(user_email, (err, user) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    //add like to post
                    Post.addLike(post, user, (err, _) => {
                        if (err) {
                            res.json({success: false, msg: err});
                        } else {
                            User.addLikeToPost(post, user, (err, post) => {
                                if (err) {
                                    res.json({success: false, msg: err});
                                } else {
                                    res.json({success: true, msg: post});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post("/disLike", (req, res) => {
    const post_id = req.body.post_id;
    const user_email = req.body.user_email;
    //Get object post
    Post.getPostById(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            //get object user
            User.getUserByEmail(user_email, (err, user) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    //add like to post
                    Post.removeLike(post, user, (err, _) => {
                        if (err) {
                            res.json({success: false, msg: err});
                        } else {
                            User.removeLikeFromPost(post, user, (err, post) => {
                                if (err) {
                                    res.json({success: false, msg: err});
                                } else {
                                    res.json({success: true, msg: post});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
