const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Article = require("./models/article");
const Comment = require("./models/comment");

router.post("/create", async (req, res, next) => {
    const session = req.session;
    if (!session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "No user has logined" });
        return;
    }

    const { articleId, content, timeStamp } = req.body;
    if (articleId && content && timeStamp) {
        try {
            const articleResult = await Article.findById(articleId).exec();
            if (articleResult !== null) {
                const newComment = await new Comment({
                    articleId: articleId,
                    authorId: session.account,
                    authorName: session.name,
                    content: content,
                    postTimeStamp: new Date(timeStamp)
                }).save();
                const updateArticle = await Article.findByIdAndUpdate(articleId, {
                    $push: {
                        comments: newComment._id
                    }
                }).exec();
                res.status(200);
                res.json({
                    status: "OK",
                    message: `Successfully created comment id ${newComment._id}`
                });
            } else {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: "Cannot find an article with the attached article id"
                });
            }
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({
            status: "FAILED",
            message: "No content has been attached to the comment"
        });
    }
});

router.post("/edit", async (req, res, next) => {
    // need to verify the session
    const session = req.session;
    if (!session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "No user has logged in" });
        return;
    }

    const { commentId, content } = req.body;
    if (commentId && content) {
        try {
            const comment = await Comment.findById(commentId).exec();
            if (comment !== null) {
                if (comment.authorId === session.account || session.isAdmin) {
                    await Comment.updateOne({ _id: commentId }, { content: content }).exec();

                    res.status(200);
                    res.json({
                        status: "OK",
                        message: `Successfully edited comment id ${commentId}`
                    });
                } else {
                    res.status(401);
                    res.json({
                        status: "FAILED",
                        message: `You dont have permission to edit this comment`
                    });
                }
            } else {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: `Comment id is invalid`
                });
            }
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({
            status: "FAILED",
            message: "No content has been attached or the comment id is invalid"
        });
    }
});

router.delete("/delete", async (req, res, next) => {
    // need to verify the session
    const session = req.session;
    if (!session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "No user has logged in" });
        return;
    }

    const { articleId, commentId } = req.query;
    if (articleId && commentId) {
        try {
            const comment = await Comment.findById(commentId).exec();
            if (comment !== null) {
                if (comment.authorId === session.account || session.isAdmin) {
                    await Comment.deleteOne({ _id: commentId }).exec();
                    await Article.findByIdAndUpdate(articleId, {
                        $pull: {
                            comments: commentId
                        }
                    }).exec();
                    res.status(200);
                    res.json({
                        status: "OK",
                        message: `Successfully deleted comment id ${commentId}`
                    });
                } else {
                    res.status(401);
                    res.json({
                        status: "FAILED",
                        message: `You dont have permission to delete this comment`
                    });
                }
            } else {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: `Comment id is invalid`
                });
            }
        } catch (err) {
            res.status(500);
            return next(err);
        }
    } else {
        res.status(400);
        res.json({
            status: "FAILED",
            message: "Article id or comment id is empty"
        });
    }
});

router.stack.forEach((r) => {
    if (r.route && r.route.path)
        console.log(JSON.stringify(r.route.methods) + "\t" + "/comment" + r.route.path);
});

module.exports = router;
