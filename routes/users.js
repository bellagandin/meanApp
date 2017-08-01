const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    //img_url:"", //TODO: add default img
    gender: req.body.gender,
    birthday: req.body.birthday,
    //bio_description:"",
    //number_of_followers: 0,
    //posts: [],
    //followings:[]
  });

  User.addUser(newUser, (err, user) => {//callback
    if(err){
      res.json({success: false, msg:err});
    } else {
      res.json({success: true, msg:newUser});
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
            posts:user.posts,
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

module.exports = router;
