const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');
const fs = require('fs');
const User = require('../models/user');
const config = require('../config/database');
const multer = require('multer');
const DIR = './public/uploads/';
const upload = multer({dest: DIR}).single('photo');


// Create Post
router.post('/createPost', (req, res, next) => {


    let newPost = new Post({
        time: req.body.time,
        recipe_title: req.body.recipe_title,
        category: req.body.category,
        co_author: req.body.co_author,
        main_img: '',//TODO: "add img"
        ingredients: req.body.ingredients,
        description: req.body.description,
        instructions: req.body.instructions,
        photos: [],
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
            console.log("here");
            User.getUserById(userId, (err, user) => {// added post id to list of post of user
                if (err) {
                    res.json({success: false, msg: "2 " + err});
                } else {
                    console.log("here");
                    if (user != null) {

                        User.addPost(user, newPost, (err, post) => {
                            if (err) {
                                res.json({success: false, msg: "1 " + err});
                            } else {
                                res.json({success: true, msg: {"post_id": newPost._id}});
                            }
                        });
                    }
                    else {
                        res.json({success: false, msg: "the user not exits"});
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
                    console.log("user", user);
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
    const comment = req.body.comment;
    const post_id = req.body._id;
    Post.getPostById(post_id, (err, post) => {
        if (err) {
            res.json({success: false, msg: err});
        } else {
            console.log("test", post);
            Post.editComment(comment, post, (err, upd) => {
                if (err) {
                    res.json({success: false, msg: err});
                } else {

                    res.json({success: true, msg: upd});
                }
            });
        }
    });
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



router.post('/uploadPhotos', function (req, res, next) {
    console.log("start");
    var path = '';
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        console.log("oldPath",req.file);
        var oldPath = req.file.path;
        console.log("oldPath",oldPath);
        let file = req.file.mimetype.split("/");

        path = req.file.path + "."+file[1];
        fs.rename
        console.log("path",path);
        console.log("req.file.mimetype",req.file.mimetype);
        console.log("req",req);
        fs.rename(oldPath, path, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
        res.json({success: true, msg: "good!"});

        //let json = {"main_img": path};
        //upload main img
        // Post.updatePost(post,json,(err, user) => {
        // if (err) {
        //     res.json({success: false, msg: err});
        // } else {
        //
        //     Post.updatePost(post,_,(err, user) => {
        //         if (err) {
        //             res.json({success: false, msg: err});
        //         } else {
        //             res.json({success: true, msg: "good!"});
        //         }
        //     });
        //
        // }});



    });
});

module.exports = router;
