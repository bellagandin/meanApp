const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        user_name: req.body.user_name,
        img_url: "http://localhost:3001/img/profile.png", //TODO: add default img
        gender: req.body.gender,
        birthday: req.body.birthday,
        bio_description: "",
        number_of_followers: 0,
        posts: [],
        liked_posts: [],
        followings: []
    });
    // Check if there is a user with the same email
    User.getUserByEmail(req.body.email, (err, user) => {//callback
        if (user === null) {
            User.addUser(newUser, (err, user) => {//callback
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    let answer = {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        user_name: req.body.user_name,
                        img_url: user.img_url,
                        gender: user.gender,
                        birthday: user.birthday,
                        bio_description: user.bio_description,
                        number_of_followers: user.number_of_followers,
                        liked_posts: user.liked_posts
                    };
                    res.json({success: true, msg: answer});
                }
            });
        }
        else {
            res.json({success: false, msg: "There is a user with the same email"});
        }
    });
});

// Update password
router.post('/updatePassword', (req, res, next) => {

    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    console.log("old password", oldPassword);
    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        // Check if the old password is right
        User.comparePassword(oldPassword, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                User.updatePassword(user, newPassword, (err, user) => {
                    if (err) throw err;
                    if (!user) {
                        return res.json({success: false, msg: "can't update password "});
                    }
                    else {
                        return res.json({success: true, msg: user});
                    }
                });
            }
            else {
                return res.json({success: false, msg: "Old Password not right"});
            }
        });

    });
});


// Authenticate
router.post('/authenticate', (req, res, next) => {
    //res.send('AUTHENTICATE');
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 10800 // 3 hours
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        img_url: user.img_url,
                        user_name:user.user_name,
                        gender: user.gender,
                        birthday: user.birthday,
                        bio_description: user.bio_description,
                        number_of_followers: user.number_of_followers,
                        liked_posts: user.liked_posts
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }

        });
    });
});


// Profile
router.get('/profile/:user_name', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    //res.send('PROFILE');
    User.getUserByUserName(req.param("user_name"),(err,user)=>{
        if(err) throw ree;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        res.json({
                    success: true,
                    user: {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        img_url: user.img_url,
                        user_name:user.user_name,
                        gender: user.gender,
                        birthday: user.birthday,
                        bio_description: user.bio_description,
                        number_of_followers: user.number_of_followers,
                        liked_posts: user.liked_posts
                    }
                });
    });
});


// Update Profile
router.post('/updateProfile', (req, res, next) => {
    //res.send('PROFILE');
    const email = req.body.email;
    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        User.updateProfile(user, req.body, (err, user) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            } else {

                res.json({
                    success: true,
                    user: {
                        id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        img_url: user.img_url,
                        gender: user.gender,
                        birthday: user.birthday,
                        bio_description: user.bio_description,
                        number_of_followers: user.number_of_followers,
                        liked_posts: user.liked_posts
                    }
                });
            }

        });
    });


});

router.post('/getMyPost', function (req, res) {

    User.getUserById(req.body.user_id, (err, user) => {//callback
        if (err) {
            res.json({success: false, msg: err});
        }
        else {
            console.log("posts", user.posts);
            const posts = user.posts;
            Post.getPostByIds(posts, (err, detailPosts) => {//callback
                console.log("posts", detailPosts);
                if (detailPosts === null) {
                    res.json({success: false, msg: err});
                }
                else {

                    let answer = detailPosts;
                    console.log("1", answer);
                    res.json({success: true, msg: answer});
                }
            });


        }
    });

});


router.post('/getFollowingsPosts', function (req, res) {
    User.getUserById(req.body.user_id, (err, user) => {//callback
        if (err) {
            res.json({success: false, msg: err});
        }
        else {
            let followings = user.followings;
            console.log("followings", followings);
            let answer = [];
            User.getFollowingsPostsId(followings, (err, result) => {//get all documents of followings
                console.log("result", result);
                if (err) {
                    res.json({success: false, msg: err});
                }
                else {
                    //get posts id of followings
                    answer = result.map(function (item) {
                        return item.posts;
                    });
                    console.log(answer);
                    //flatten array of posts id
                    let posts_ids = [].concat.apply([], answer);
                    Post.getPostByIds(posts_ids, (err, detailPosts) => {//callback
                        console.log("posts", detailPosts);
                        if (detailPosts === null) {
                            res.json({success: false, msg: err});
                        }
                        else {
                            res.json({success: true, msg: detailPosts});
                        }
                    });
                }
            });
        }
    });
});


router.post("/addFollowing", function (req, res) {
    let user_id = req.body.user_id;
    let following_email = req.body.following_email;
    //find user
    User.getUserById(user_id, (err, user) => {
        if (user===null || err) {
            res.json({success: false, msg: err});
        }
        else {
            add_following_function(user,following_email,res);
        }
    });
});

router.post("/removeFollowing", function (req, res) {
    let user_id = req.body.user_id;
    let following_email = req.body.following_email;
    User.getUserById(user_id, (err, user) => {//find user
        if (err) {
            res.json({success: false, msg: err});
        }
        else {
            User.getUserByEmail(following_email, (err, following_user) => {//find following user
                if (err) {
                    res.json({success: false, msg: err});
                }
                else {
                    User.removeFollowing(user, following_user, (err, user2) => {//callback
                        if (err) {
                            res.json({success: false, msg: err});
                        }
                        else {
                            User.removeFollower(user, following_user, (err, user2) => {//callback
                                    if (err) {
                                        res.json({success: false, msg: err});
                                    }
                                    else {
                                        res.json({success: true, msg: user2});
                                    }
                                },//end callback
                                (() => {res.json({success: false, msg: "the user not following me."});})
                            );
                        }
                        },//end callback
                        (() => {res.json({success: false, msg: "the user already follows."});})
                    );

                }
            },(err) => {

                }
                );
        }
    });
});


// router.post('/upload', function (req, res) {
//     var tempPath = req.files.file.path,
//         targetPath = path.resolve('./uploads/image.png');
//     if (path.extname(req.files.file.name).toLowerCase() === '.png') {
//         fs.rename(tempPath, targetPath, function(err) {
//             if (err) throw err;
//             console.log("Upload completed!");
//         });
//     } else {
//         fs.unlink(tempPath, function () {
//             if (err) throw err;
//             console.error("Only .png files are allowed!");
//         });
//     }
//     // ...
// });

module.exports = router;


const add_following_function = function (user,following_email,res) {
    User.getUserByEmail(following_email, (err, following_user) => {
        if (following_user===null || err) {
            res.json({success: false, msg: err});
        }
        else {
            User.addFollowing(user, following_user, (err, user2) => {//callback
                    if (err) {
                        res.json({success: false, msg: err});
                    }
                    else {
                        add_follower_function(user, following_user,res);
                    }
                },//end callback
                ((err, user2) => {res.json({success: false, msg: "the user already following."});})
            );
        }
    });
};

var add_follower_function = function(user, following_user,res)
{
    //add follower
    User.addFollower(user, following_user, (err, user) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            }
            else {
                res.json({success: true, msg: user});
            }
        },//end callback
        (() => {res.json({success: false, msg: "the user already follows."});})
    );
};