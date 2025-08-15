const commentModel = require('../models/Comment');
const newsModel = require('../models/News');
const createError = require('../utils/error-message')
const { validationResult } = require('express-validator')


const allComments = async (req, res, next) => {
    let comments;
    if(req.role == 'admin'){
        comments = await commentModel.find()
        .populate('article',  'title' )  
        .sort({ createdAt: -1 })
    }else{
        const news= await newsModel.find({author: req.id})
        const newsIds = news.map(news => news._id)
        comments = await commentModel.find({article: {$in: newsIds}})
        .populate('article',  'title' )
        .sort({ createdAt: -1 })
    }
    // res.json(comments)
    res.render('admin/comments', {comments,role: req.role})
    if (!comments) return next(createError(404, 'No comments found'))
    
}


const updateCommentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const comment = await commentModel.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        if (!comment) return next(createError(404, 'Comment not found'));
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

const deleteComments = async (req, res,next) => {
    try {
        const { id } = req.params;
        const comment = await commentModel.findByIdAndDelete(id);
        if (!comment) return next(createError(404, 'Comment not found'));
        res.json({success: true});
    } catch (error) {
        next(error)
    }
}
module.exports = {
    allComments,
    updateCommentStatus,
    deleteComments
}