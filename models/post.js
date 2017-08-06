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
    main_img: {
        type: String,
    },
    description:{
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    instructions: {
        type: Array,
        required: true
    },
    photos:{
      type: Array,
    },
    likes: {
        type: Array,
    },
    comments: {
        type: Array,
    },
    id_generator: {
        type: Number,
    }
});

const ObjectId = mongoose.Schema.ObjectId;
const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPostById = function (id, callback) {
    Post.findById(id, callback);
};

module.exports.getPostByIds = function (ids, callback) {
    Post.find({_id: {$in: ids}}, callback);
};

module.exports.getPostByUsername = function (email, callback) {
    const query = {email: email};
    Post.findOne(query, callback);
};

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);//save new post post
};

module.exports.removePost = function (post_id, callback) {
    var udp = {_id: post_id};
    Post.remove(udp,callback);//save new post post
};

module.exports.updatePost = function (post, updateData, callback) {
    delete  updateData._id;
    Post.update({$set: updateData}, callback);
};

module.exports.addCommentToPost = function (comment, post, callback) {
    let addComment = {comments: post.comments.concat(comment), id_generator: post.id_generator + 1};
    Post.update({$set: addComment}, callback);
};


module.exports.removeCommentFromPost = function (comment_id, post, success) {

    let newCommentList = post.comments.filter((item) => {
        return item.comment_id !== comment_id;
    });
    let updateData = {comments: newCommentList};
    Post.update({$set: updateData}, success);

};

module.exports.addLike = function ( post,user, callback) {
    let addLike = {likes: post.likes.concat(user._id)};
    Post.update({$set: addLike}, callback);

};


module.exports.removeLike = function ( post,user, callback) {
    let newCommentList = post.likes.filter((item) => {
        return item !== user._id;
    });
    let update = {likes:newCommentList};
    Post.update({$set: update}, callback);
};


module.exports.editComment = function ( comment,post, callback) {
    console.log("comment", comment);
    let newCommentList = post.comments.filter((item) => {
        return item.comment_id !== comment.comment_id;
    });
    let editComment = {comments: newCommentList.concat(comment)};
    console.log("editComment", editComment);
    Post.update({$set: editComment}, callback);
};

module.exports.getPostsByTitle = function ( title, callback) {
    Post.find({"recipe_title":title}, callback);
};


module.exports.getPostsByText = function ( text, callback) {
    Post.find({"username" : {$regex : ".*son.*"}});
};