const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    img_url:"", //TODO: add default img
    gender: req.body.gender,
    birthday: req.body.birthday,
    bio_description:"",
    number_of_followers: 0,
    posts: [],
    followings:[]
  });

  User.addUser(newUser, (err, user) => {//callback
    if(err){
      res.json({success: false, msg:'Failed to register user.Try again'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  res.send('AUTHENTICATE');
});

// Profile
router.get('/profile', (req, res, next) => {
  res.send('PROFILE');
});

module.exports = router;
