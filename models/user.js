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
    user_name: {
        type: String,
        required: true
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
    self_description: {
        type: String,
    },
    followers: {
        type: Array,
    },
    posts: {
        type: Array,
    },
    liked_posts: {
        type: Array,
    },
    followings: {
        type: Array,
    },
    rate:{
        type:Number
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.getFollowingsPostsId = function (FollowingsIds, callback) {
    User.find({_id: {$in: FollowingsIds}}, callback);
};

module.exports.findUser = function (posts, callback) {
    User.find({_id: {$in: posts}}, callback);
};

module.exports.getUserByEmail = function (email, callback) {
    const query = {email: email};
    User.findOne(query, callback);
};
module.exports.getUserByUserName = function (user_name, callback) {
    const query = {user_name: user_name};
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

module.exports.updateProfile = function (user, updateData, callback) {
    if (updateData) {
        delete  updateData._id;
    }
    //updateData.splice(0, 1);
    user.update({$set: updateData}, callback);
};

module.exports.updatePassword = function (user, newPassword, callback) {
    bcrypt.genSalt(10, (err, salt) => {//callback
        console.log("salt", salt);
        bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            let newPass = hash;
            console.log("newPass", newPass);
            let updateData = {password: newPass};
            console.log(updateData);
            user.update({$set: updateData}, callback);
        });
    });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};


module.exports.addPost = function (user, post, callback) {
    let updateData = {posts: user.posts.concat(post._id)};
    user.update({$set: updateData}, callback);
};


module.exports.removePost = function (user, post_id, callback) {
    let newPostList = user.posts.filter((item) => {
        return item != post_id;
    });
    let updateData = {posts: newPostList};
    user.update({$set: updateData}, callback);
};

module.exports.addFollowing = function (user, following, callback) {

    if (user.followings.indexOf(following._id) === -1) {
        let updateData = {followings: user.followings.concat(following._id)};
        console.log("updateData",updateData);
        user.update({$set: updateData}, callback);
    }
    else {
        let updateData = {};
        user.update({$set: updateData}, callback);
    }

};

module.exports.removeFollowing = function (user, following_user, success, failure) {
    let temp = String(following_user._id);
    //console.log("!!!!!!!",user.followings ,following_user._id,temp );
    let newCommentList = user.followings.filter((item) => {
        //console.log(item!== following_user._id, item!= temp);
        return item!= temp;
    });
    //console.log(">>>>>>>>",newCommentList);
    let updateData = {followings: newCommentList};
    user.update({$set: updateData}, success);
};


module.exports.addFollower = function (follower, followed, success, failure) {
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

module.exports.removeFollower = function (follower, followed, success, failure) {
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

module.exports.addLikeToPost = function (post, user, callback) {
    let updateData = {liked_posts: user.liked_posts.concat(post._id)};
    console.log(updateData);
    user.update({$set: updateData}, callback);
};

module.exports.removeLikeFromPost = function (post, user, callback) {
    let newLikesList = user.liked_posts.filter((item) => {
        //console.log(item,post._id,''+post._id,item!= ''+post._id);
        return item!= ''+post._id;
    });
    console.log("newLikesList",newLikesList);

    let upd = {liked_posts:newLikesList};
    console.log("upd",upd);
    user.update({$set: upd}, callback);
};


module.exports.IncRate = function (user, callback) {
    let newRate = user.rate+1;
    let UpdateData = {rate:newRate};
    console.log("upd",UpdateData);
    user.update({$set: UpdateData}, callback);
};

module.exports.DecRate = function (user, callback) {
    let newRate = user.rate-1;
    let UpdateData = {rate:newRate};
    console.log("upd",UpdateData);
    user.update({$set: UpdateData}, callback);
};

module.exports.findUserRegex = function (user, callback) {
    User.find({user_name:{$regex:user}},callback);
};


module.exports.gelAllUsers = function (callback) {
    User.find(callback);
};