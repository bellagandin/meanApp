const mongoose = require('mongoose');
const config = require('../config/database');

// Post Schema
const PostSchema = mongoose.Schema({
    time: {
        type: Timestamp,
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
        required: true
    }
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPostById = function (id, callback) {
    User.findById(id, callback);
};

// module.exports.getPostByUsername = function (email, callback) {
//     const query = {email: email};
//     User.findOne(query, callback);
// };

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
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


