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
    img_url:"http://localhost:3000/img/profile.png", //TODO: add default img
    gender: req.body.gender,
    birthday: req.body.birthday,
    bio_description:"",
    number_of_followers: 0,
    posts: [],
    followings:[]
  });

  User.getUserByUsername(newUser.email,(err, user) => {//callback
      if(err==null) {
          User.addUser(newUser, (err, user) => {//callback
              if(err){
                  res.json({success: false, msg:err});
              } else {
                  res.json({success: true, msg:newUser});
              }
          });
      }
      else
      {
          res.json({success: false, msg:err});
      }
  });
});

// Update password
router.post('/updatePassword', (req, res, next) => {
  //res.send('AUTHENTICATE');
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  console.log("old password", oldPassword);
  User.getUserByUsername(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({success: false, msg: 'User not found'});
    }
    console.log("Good",user.password);

        User.updatePassword(user, newPassword, (err, user) => {
          if (err) throw err;
          if (!user) {
            return res.json({success: false, msg: "can't update password "});
          }
          else {
            return res.json({success: true, msg: user});
          }
        });


  });
});


// Authenticate
router.post('/authenticate', (req, res, next) => {
  //res.send('AUTHENTICATE');
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByUsername(email, (err, user) => {
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
            img_url:user.img_url,
            gender: user.gender,
            birthday: user.birthday,
            bio_description: user.bio_description,
            number_of_followers:user.number_of_followers,
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }

    });
  });
});


// Profile
router.get('/profile',passport.authenticate('jwt', {session:false}), (req, res, next) => {
  //res.send('PROFILE');
  res.json({user: req.user});
});

// Update Profile
router.post('/updateProfile', (req, res, next) => {
  //res.send('PROFILE');
  const email = req.body.email;
  User.getUserByUsername(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({success: false, msg: 'User not found'});
    }

    user.first_name= req.body.first_name;
    user.last_name= req.body.last_name;
    user.email= req.body.email;
    user.img_url= req.body.img_url;
    user.gender= req.body.gender;
    user.birthday = req.body.birthday;
    user.bio_description = req.body.bio_description;
    user.number_of_followers =req.body.number_of_followers;
    user.posts = req.body.posts;
    user.followings = req.body.followings;


    User.updateProfile(user,req.body, (err, user) => {//callback
      if (err) {
        res.json({success: false, msg: err});
      } else {
        res.json({success: true, msg: user});
      }

    });
  });


});

router.post('/getMyPost' , function (req, res){
    var answer = [];
    User.getUserById(req.body.user_id, (err, user) => {//callback
        if(err)
        {
            res.json({success: false, msg: err});
        }
        else
        {
            console.log("posts",user.posts);
            const posts = user.posts;
                Post.getPostByIds(posts , (err, detailPosts) => {//callback
                    console.log("posts",detailPosts);
                    if(detailPosts==null)
                    {
                        res.json({success: false, msg: err});
                    }
                    else
                    {

                        answer=detailPosts;
                        console.log("1",answer);
                        res.json({success: true, msg: answer});
                    }
                });



        }
    });

});


router.post('/getFollowingsPosts' , function (req, res) {
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
                        if (detailPosts == null) {
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
    let following_id = req.body.following_id;
    User.getUserById(user_id, (err, user) => {//find user
        if (err) {
            res.json({success: false, msg: err});
        }
        else {
            User.addFollowing(user, following_id, (err, user) => {//callback
                if (err) {
                    res.json({success: false, msg: err});
                }
                else {
                    res.json({success: true, msg: user});
                }
            });
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
