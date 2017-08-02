const mongoose = require('mongoose');
const config = require('../config/database');
const User = require('./user');
// Post Schema
const PostSchema = mongoose.Schema({
    time: {
        type: Date,
        required: true
    },
    recipe_title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    co_author: {
        type: Array,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount_of_likes: {
        type: Number,
        required: true
    },
    amount_of_dislike: {
        type: Number,
        required: true
    },
    comments: {
        type: Array,
    }
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPostById = function (id, callback) {
    Post.findById(id, callback);
};

module.exports.getPostByIds = function (ids, callback) {

    Post.findById(ids, callback);
};

module.exports.getPostByUsername = function (email, callback) {
    const query = {email: email};
    Post.findOne(query, callback);
};

// module.exports.UpdateUserPost = function (userId,newPost, callback) {
//     console.log(userId);
//     console.log(newPost);
//     User.getUserById(userId, (err, user) => {//callback
//         console.log(user);
//         if(user!=null) {
//             console.log(newPost._id);
//             let updateData = {posts  : user.posts.concat(newPost._id)};
//             console.log(updateData);
//             user.update({$set: updateData}, callback);// added post id to list of post of user
//
//         }
//     });
//
// };

module.exports.addPost = function (newPost, callback) {
    console.log(newPost);
    newPost.save(callback);//save new post post
};

// module.exports.updatePost = function(user,updateData, callback){
//     delete  updateData._id;
//     console.log(updateData);
//     console.log(user);
//     user.update({$set:updateData},callback);
// };
//
// module.exports.updatePassword = function(user,newPassword, callback){
//     console.log("new passsword",newPassword);
//     bcrypt.genSalt(10, (err, salt) => {//callback
//         console.log("salt",salt);
//     bcrypt.hash(newPassword, salt, (err, hash) => {
//         if (err) throw err;
//     let newPass = hash;
//     console.log("newPass",newPass);
//     let updateData = {password:newPass};
//     console.log(updateData);
//     user.update({$set:updateData},callback);
// });
// });
// };

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
    callback(null, isMatch);
});
};


