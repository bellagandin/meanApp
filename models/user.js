const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  user_name:{
    type:String,
  },
  img_url: {
    type: String,
  },
  gender: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
  },
  bio_description: {
    type: String,
  },
  number_of_followers: {
  type: Number,
},
  posts: {
    type: Array,
  },
  followings: {
    type: Array,
  },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getFollowingsPostsId= function (FollowingsIds, callback) {
    User.find({_id: { $in:FollowingsIds}}, callback);
        //.map(function(myDoc) {myDoc.posts;});
};


module.exports.getUserByUsername = function (email, callback) {
  const query = {email: email};
  User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {

  bcrypt.genSalt(10, (err, salt) => {//callback
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.updateProfile = function(user,updateData, callback){
  delete  updateData._id;
  console.log(updateData);
  console.log(user);
  user.update({$set:updateData},callback);
};

  module.exports.updatePassword = function(user,newPassword, callback){
    console.log("new passsword",newPassword);
    bcrypt.genSalt(10, (err, salt) => {//callback
      console.log("salt",salt);
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) throw err;
        let newPass = hash;
        console.log("newPass",newPass);
        let updateData = {password:newPass};
        console.log(updateData);
        user.update({$set:updateData},callback);
      });
    });
  };

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
};


module.exports.addPost = function (user, post,callback)
{
  let updateData = {posts: user.posts.concat(post._id)};
  user.update({$set:updateData},callback);
};

module.exports.addFollowing = function (user, following_id,callback)
{
    console.log(following_id);
    console.log(user);
    let updateData = {followings: user.followings.concat(following_id)};
    user.update({$set:updateData},callback);
};