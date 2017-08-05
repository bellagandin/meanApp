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
    console.log("addPost",newPost);
    newPost.save(callback);//save new post post
};

module.exports.removePost = function (post_id, callback) {
    console.log("removePost",post_id);
    var udp = {_id: post_id};
    console.log(udp);
    Post.remove(udp,callback);//save new post post
};

module.exports.updatePost = function (post, updateData, callback) {
    delete  updateData._id;
    //updateData.splice(0, 1);
    console.log(updateData);
    console.log(post);
    Post.update({$set: updateData}, callback);
};

module.exports.addCommentToPost = function (comment, post, callback) {
    let addComment = {comments: post.comments.concat(comment), id_generator: post.id_generator + 1};
    console.log("comment", addComment);
    Post.update({$set: addComment}, callback);
};


module.exports.removeCommentFromPost = function (comment_id, post, success) {

    let newCommentList = post.comments.filter((item) => {
        return item.comment_id !== comment_id;
    });
    console.log(newCommentList);
    let updateData = {comments: newCommentList};
    Post.update({$set: updateData}, success);

};

module.exports.addLike = function ( post,user, callback) {
    console.log("post.likes",post.likes);
    console.log("user._id",user._id);
    let addLike = {likes: post.likes.concat(user._id)};
    console.log("comment", addLike);
    Post.update({$set: addLike}, callback);

};


module.exports.removeLike = function ( post,user, callback) {
    console.log("post.likes",post.likes);
    console.log("user._id",user._id);
    let newCommentList = post.likes.filter((item) => {
        return item !== user._id;
    });
    console.log("newCommentList", newCommentList);
    let update = {likes:newCommentList};
    console.log("update", update);
    Post.update({$set: update}, callback);
};
