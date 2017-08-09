const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const config = require('../config/database');
const multer = require('multer');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        user_name: req.body.user_name,
        img_url: "/img/profile.png",
        gender: req.body.gender,
        birthday: req.body.birthday,
        self_description: "",
        followers: [],
        posts: [],
        liked_posts: [],
        followings: [],
        rate: 0,
    });
    // Check if there is a user with the same email
    User.getUserByEmail(req.body.email, (err, user) => {//callback
        if (user === null) {
            User.getUserByUserName(req.body.user_name, (err, user) => {//callback
                if (user === null) {
                    User.addUser(newUser, (err, user) => {//callback
                        if (err) {
                            res.json({success: false, msg: err});
                        } else {
                            let answer = {
                                user_id: user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                user_name: req.body.user_name,
                                img_url: user.img_url,
                                gender: user.gender,
                                birthday: user.birthday,
                                self_description: user.self_description,
                                followers: user.followers,
                                liked_posts: user.liked_posts,
                                followings: user.followings,
                                rate: 0,
                            };
                            res.json({success: true, msg: answer});
                        }
                    });
                }
                else {
                    res.json({success: false, msg: "There is a user with the same username"});
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
                        user_name: user.user_name,
                        gender: user.gender,
                        birthday: user.birthday,
                        self_description: user.self_description,
                        followers: user.followers,
                        liked_posts: user.liked_posts,
                        followings: user.followings,
                        rate: user.rate
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
    User.getUserByUserName(req.param("user_name"), (err, user) => {
        if (err) throw ree;
        if (!user) {
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
                user_name: user.user_name,
                gender: user.gender,
                birthday: user.birthday,
                self_description: user.self_description,
                followers: user.followers,
                liked_posts: user.liked_posts,
                followings: user.followings,
                rate: user.rate
            }
        });
    });
});


// Update Profile
router.post('/updateProfile', (req, res, next) => {
    console.log("here", req.body.email);
    const email = req.body.email;
    console.log("test!!!!",req.body);
    User.getUserByEmail(email, (err, user) => {
        if (user==null) {
            res.json({success: false, msg: "the user not found"});}
        else {
            User.updateProfile(user, req.body, (err, upd) => {//callback
                if (err) {
                    res.json({success: false, msg: err});
                } else {
                    User.getUserByEmail(req.body.email, (err, user) => {
                        if (user === null) throw err;
                        if (user !== null) {
                            res.json({success: true, msg: user});
                        }
                    });
                }
            });
        }

    });

});



router.post('/getMyPost', function (req, res) {

    User.getUserById(req.body.user_id, (err, user) => {//callback
        if (user === null || err) {
            res.json({success: false, msg: err});
        }
        else {
            const posts = user.posts;
            Post.getPostByIds(posts, (err, detailPosts) => {//callback
                if (detailPosts === null) {
                    res.json({success: false, msg: err});
                }
                else {

                    let answer = detailPosts;
                    res.json({success: true, msg: answer});
                }
            });


        }
    });

});


router.post('/getFollowingsPosts', function (req, res) {
    // User.getUserById(req.body.user_id, (err, user) => {//callback
    //     if (err) {
    //         res.json({success: false, msg: err});
    //     }
    //     else {
    //         let followings = user.followings;
    //         console.log("followings", followings);
    //         let answer = [];
    //         User.getFollowingsPostsId(followings, (err, result) => {//get all documents of followings
    //             console.log("result", result);
    //             if (err) {
    //                 res.json({success: false, msg: err});
    //             }
    //             else {
    //                 //get posts id of followings
    //                 answer = result.map(function (item) {
    //                     return item.posts;
    //                 });
    //                 console.log(answer);
    //                 //flatten array of posts id
    //                 let posts_ids = [].concat.apply([], answer);
    //                 Post.getPostByIds(posts_ids, (err, detailPosts) => {//callback
    //                     console.log("posts", detailPosts);
    //                     if (detailPosts === null) {
    //                         res.json({success: false, msg: err});
    //                     }
    //                     else {
    //                         res.json({success: true, msg: detailPosts});
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // });
    getAllPostOfFollowed(req, (result) => {
        res.json(result);
    });

});


router.post("/addFollowing", function (req, res) {
    let username = req.body.username;
    let following_email = req.body.following_email;
    //find user
    User.getUserByUserName(username, (err, user) => {
        if (user === null || err) {
            res.json({success: false, msg: err});
        }
        else {
            add_following_function(user, following_email, res);
        }
    });
});

router.post("/removeFollowing", function (req, res) {
    let username = req.body.username;
    console.log(username);
    let following_email = req.body.following_email;
    User.getUserByUserName(username, (err, user) => {//find user
        if (user === null || err) {
            res.json({success: false, msg: err});
        }
        else {
            User.getUserByEmail(following_email, (err, following_user) => {//find following user
                    if (err) {
                        res.json({success: false, msg: err});
                    }
                    else {
                        console.log(user, following_email);
                        User.removeFollowing(user, following_user, (err, _) => {//callback
                                if (err) {
                                    res.json({success: false, msg: err});
                                }
                                else {
                                    User.removeFollower(user, following_user, (err, user2) => {//callback
                                            if (err) {
                                                res.json({success: false, msg: err});
                                            }
                                            else {
                                                User.getUserByUserName(req.body.username,  (err, answer) => {//callback
                                                    if (err) {
                                                        res.json({success: false, msg: err});
                                                    }
                                                    else {
                                                        res.json({success: true, msg: answer});
                                                    }
                                                });
                                            }
                                        },//end callback
                                        (() => {
                                            res.json({success: false, msg: "the user not following me."});
                                        })
                                    );
                                }
                            },//end callback
                            (() => {
                                res.json({success: false, msg: "the user already follows."});
                            })
                        );

                    }
                }, (err) => {

                }
            );
        }
    });
});


router.post('/upload/:user_id', function (req, res) {
    console.log("start");
    console.log(req.param('user_id'));
    let postDest = './public/img/' + req.param('user_id');
    console.log("postDest", postDest);
    let storage = multer.diskStorage({
        destination: postDest,
        filename: function (req, file, cb) {
            let extArray = file.mimetype.split("/");
            let extension = extArray[extArray.length - 1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
        }
    });


    let upload = multer({storage: storage}).array('photos', 10);
    var path = '';
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        console.log("req", req.files);
        const user_id = req.param('user_id');

        User.getUserById(user_id, (err, user) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            }
            else {

                let path = req.files[0].path.split("public");
                console.log(path);
                console.log("path", path[1]);
                let update = {"img_url": path[1]};
                User.updateProfile(user, update, (err, _) => {//callback
                    if (err) {
                        res.json({success: false, msg: err});
                    }
                    else {
                        res.json({
                            success: true,
                            msg: {
                                id: user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                img_url: path[1],
                                gender: user.gender,
                                birthday: user.birthday,
                                self_description: user.self_description,
                                followers: user.followers,
                                liked_posts: user.liked_posts,
                                rate: user.rate,
                            }
                        });
                        //res.json({success: true, msg: req.files[0].path});
                    }
                });
            }
        });


    });
});

router.post("/search", (req, res) => {
    const type = req.body.type;
    console.log(type);
    switch (type) {
        case "user":
            let value = req.body.value;
            if (value != null) {
                console.log("start search");
                User.getUserByUserName(value, (err, user) => {
                    if (err) {
                        res.json({success: false, msg: err});
                    } else {
                        res.json({success: true, msg: user});
                    }
                });
            }
            break;
        case "title":
            let title = req.body.value;
            console.log(title);
            getAllPostOfFollowed(req, (result) => {
                if (result !== null) {
                    let arr = result["msg"];

                    let final_result = arr.filter((post) => {
                        return (post["recipe_title"].includes(title))
                    });
                    //console.log("final_result",final_result);
                    //count the number of time  text in post
                    var helper = final_result.map((item) => {
                        let count = 0;
                        count += item["recipe_title"].match(title).length;
                        return [count, item];
                    });

                    //sort the post according to amount of text in posts
                    let answer = helper.sort(function (a, b) {
                        return b[0] - a[0];
                    });
                    //console.log("answer",answer);
                    let fix_answer = [];

                    //delete the count from the posts
                    for (let i in answer) {
                        fix_answer.push(answer[i][1]);
                    }
                    //console.log("fix_answer",fix_answer);
                    res.json({success: true, msg: fix_answer});
                }
                else {
                    res.json({success: true, msg: []});
                }

            });


            break;
        case "text":
            const text = req.body.value;
            getAllPostOfFollowed(req, (result) => {

                let arr = result["msg"];
                console.log("result", arr);
                console.log('text', text);
                if (result != null) {
                    let final_result = arr.filter((post) => {
                        return predicate(post, text)
                    });
                    //console.log("final_result",final_result);
                    //count the number of time  text in post
                    var helper = final_result.map((item) => {
                        let count = 0;
                        if (item["description"].match(text) !== null) {
                            count += item["description"].match(text).length;
                        }
                        item["instructions"].forEach(function (entry) {
                            if (entry["description"].match(text) !== null) {
                                count += entry["description"].match(text).length;
                            }
                        });
                        if (item["recipe_title"].match(text) !== null) {
                            count += item["recipe_title"].match(text).length;
                        }
                        return [count, item];
                    });

                    //sort the post according to amount of text in posts
                    let answer = helper.sort(function (a, b) {
                        return b[0] - a[0];
                    });
                    //console.log("answer",answer);
                    let fix_answer = [];

                    //delete the count from the posts
                    for (let i in answer) {
                        fix_answer.push(answer[i][1]);
                    }
                    //console.log("fix_answer",fix_answer);

                    //send it
                    res.json({success: true, msg: fix_answer});
                }
                else {
                    res.json({success: true, msg: []});
                }
            });

            break;
    }
});

router.post("/LikedPost", (req, res) => {
    getAllPostOfFollowed(req, (result) => {
        let arr = result["msg"];
        console.log("result", arr);
        let arrSorted = arr.sort(function (a, b) {
            return b["likes"].length - a["likes"].length;
        });
        console.log(arrSorted);
        res.json({success: true, msg: arrSorted});
    });

});

router.post("/LikedUsers", (req, res) => {
    const user_id = req.body.user_id;
    User.getUserById(user_id, (err, user) => {
        if (err) {
            res.json({success: false, msg: err});
        }
        else {
            const followings = user.followings;
            console.log(followings);
            User.findUser(followings, (err, docs) => {
                if (err) {
                    res.json({success: false, msg: err});
                }
                else {
                    console.log("docs",docs);
                    let answer = docs.sort(function (a, b) {
                        return b.rate - a.rate;
                    });
                    res.json({success: true, msg: answer});
                }
            });
        }
    });

});


module.exports = router;


const add_following_function = function (user, following_email, res) {
    User.getUserByEmail(following_email, (err, following_user) => {
        if (following_user === null || err) {
            res.json({success: false, msg: err});
        }
        else {
            User.addFollowing(user, following_user, (err, user2) => {//callback
                    if (err) {
                        res.json({success: false, msg: err});
                    }
                    else {
                        add_follower_function(user, following_user, res);
                    }
                },//end callback
                ((err, user2) => {
                    res.json({success: false, msg: "the user already following."});
                })
            );
        }
    });
};

var add_follower_function = function (user, following_user, res) {
    //add follower
    User.addFollower(user, following_user, (err, udp) => {//callback
            if (err) {
                res.json({success: false, msg: err});
            }
            else {
                res.json({success: true, msg: user});
            }
        },//end callback
        (() => {
            res.json({success: false, msg: "the user already follows."});
        })
    );
};

var getAllPostOfFollowed = function (req, callback) {
    const user_id = req.body.user_id;
    User.getUserById(user_id, (err, user) => {//callback
        if (user === null || err) {
            callback({success: false, msg: err});
        }
        else {
            console.log("user", user);
            let followings = user.followings;
            console.log("followings", followings);
            let answer = [];
            User.getFollowingsPostsId(followings, (err, result) => {//get all documents of followings
                console.log("result", result);
                if (err) {
                    callback({success: false, msg: err});
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
                            callback({success: false, msg: err});
                        }
                        else {
                            callback({success: true, msg: detailPosts});
                        }

                    });
                }
            });
        }
    });
};

var predicate = function (post, text) {
    return ((post["description"].includes(text))
        ||
        (post["instructions"].forEach(function (entry) {
            entry["description"].includes(text);
        }))
        || (post["recipe_title"].includes(text)))
};