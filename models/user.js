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
  followers: {
  type: Array,
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
};


module.exports.getUserByEmail = function (email, callback) {
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
    console.log("new password",newPassword);
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

module.exports.addFollowing = function (user, following,callback)
{
    console.log(user.followings);

    console.log(user.followings.indexOf(following._id) );
    if (user.followings.indexOf(following._id) === -1) {
        let updateData = {followings: user.followings.concat(following._id)};
        user.update({$set: updateData}, callback);
    }
    else {
        let updateData = {};
        user.update({$set: updateData}, callback);
    }

};

module.exports.removeFollowing = function (follower, followed,success,failure)
{
    console.log(follower.followings);
    console.log(followed._id);

    console.log(user.followings.indexOf(following._id) );
    let index = user.followings.indexOf(following._id);
    if (index > -1) {

        user.followings.splice(index, 1);

        let updateData = {followings: user.followings};
        user.update({$set: updateData}, success);
    }
    else {
        failure();
    }
};


module.exports.addFollower = function (follower, followed,success,failure)
{
    let index = followed.followers.indexOf(follower._id);
    if (index === -1) {
        let updateData = {followers: followed.followers.concat(follower._id)};
        followed.update({$set: updateData}, success);
    }
    else {
        //let updateData = {};
        //followed.update({$set: updateData}, callback);
        failure();
    }
};

module.exports.removeFollower = function (follower, followed,success,failure)
{
    let index = followed.followers.indexOf(follower._id);
    if (index > -1) {
        followed.followers.splice(index, 1);
        let updateData = {followers: followed.followers};
        followed.update({$set: updateData}, success);
    }
    else {

        failure();
    }
};