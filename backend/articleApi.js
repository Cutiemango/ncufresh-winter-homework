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

    const { content, timeStamp } = req.body;
    if (content && timeStamp) {
        try {
            const newArticle = await new Article({
                authorId: session.account,
                authorName: session.name,
                content: content,
                comments: [],
                postTimeStamp: new Date(timeStamp)
            }).save();

            res.status(200);
            res.json({
                status: "OK",
                message: `Successfully created article id ${newArticle._id}`,
                article: {
                    id: newArticle._id,
                    authorId: newArticle.authorId,
                    authorName: newArticle.authorName,
                    content: newArticle.content,
                    comments: newArticle.comments,
                    postTimeStamp: newArticle.postTimeStamp
                }
            });
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({
            status: "FAILED",
            message: "No content has been attached to the article"
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

    const { articleId, content } = req.body;
    if (articleId && content) {
        try {
            const article = await Article.findById(articleId).exec();
            if (article !== null) {
                if (article.authorId === session.account || session.isAdmin) {
                    await Article.updateOne({ _id: articleId }, { content: content }).exec();
                    res.status(200);
                    res.json({
                        status: "OK",
                        message: `Successfully edited article id ${articleId}`
                    });
                } else {
                    res.status(401);
                    res.json({
                        status: "FAILED",
                        message: `You dont have permission to edit this article`
                    });
                }
            } else {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: "Article id not found"
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
            message: "No content has been attached or the article id is invalid"
        });
    }
});

router.get("/query", async (req, res, next) => {
    const articleId = req.query.articleId;
    if (articleId) {
        try {
            const result = await Article.findById(articleId).exec();
            if (result !== null) {
                let commentArray = [];
                const fetchTasks = result.comments.map((commentId) =>
                    Comment.findById(commentId).exec()
                );
                for await (const comment of fetchTasks) {
                    commentArray.push({
                        id: comment._id,
                        articleId: articleId,
                        authorId: comment.authorId,
                        authorName: comment.authorName,
                        content: comment.content,
                        postTimeStamp: comment.postTimeStamp
                    });
                }

                res.status(200);
                res.json({
                    status: "OK",
                    message: `Found article id ${articleId}`,
                    article: {
                        id: articleId,
                        authorId: result.authorId,
                        authorName: result.authorName,
                        content: result.content,
                        comments: commentArray,
                        postTimeStamp: result.postTimeStamp
                    }
                });
            } else {
                res.status(400);
                res.json({ status: "FAILED", message: "Article not found" });
            }
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "Article id cannot be empty" });
    }
});

router.get("/query_batch", async (req, res, next) => {
    // ipp = items per page
    let { page, ipp } = req.query;

    if (page && ipp) {
        page = Number(page);
        ipp = Number(ipp);
        try {
            const result = await Article.find()
                .sort({ postTimeStamp: "desc" })
                .skip((page - 1) * ipp)
                .limit(ipp)
                .exec();

            const articles = result.map((article) => {
                return {
                    id: article._id,
                    authorId: article.authorId,
                    authorName: article.authorName,
                    content: article.content,
                    comments: article.comments,
                    postTimeStamp: article.postTimeStamp
                };
            });

            res.status(200);
            res.json({
                status: "OK",
                message: `Query successful`,
                articles: articles
            });
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "Page or ipp cannot be empty" });
    }
});

router.get("/query_amount", async (req, res, next) => {
    try {
        const amount = await Article.countDocuments();
        res.status(200);
        res.json({
            status: "OK",
            message: `${amount} articles queried`,
            amount: amount
        });
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

router.get("/query_latest", async (req, res, next) => {
    try {
        const result = await Article.findOne().sort({ postTimeStamp: "desc" }).exec();
        if (result !== null) {
            let commentArray = [];
            for (commentId of result.comments) {
                const comment = await Comment.findById(commentId).exec();

                commentArray.push({
                    id: comment._id,
                    articleId: articleId,
                    authorId: comment.authorId,
                    authorName: comment.authorName,
                    content: comment.content,
                    postTimeStamp: comment.postTimeStamp
                });
            }
            res.status(200);
            res.json({
                status: "OK",
                message: `Fetched latest article with id ${result._id}`,
                article: {
                    id: result._id,
                    authorId: result.authorId,
                    authorName: result.authorName,
                    content: result.content,
                    comments: commentArray,
                    postTimeStamp: result.postTimeStamp
                }
            });
        } else {
            res.status(400);
            res.json({
                status: "FAILED",
                message: "Cannot find the latest article"
            });
        }
    } catch (error) {
        res.status(500);
        return next(error);
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

    const articleId = req.query.articleId;
    if (articleId) {
        try {
            const result = await Article.findById(articleId).exec();
            if (result !== null) {
                if (result.authorId === session.account || session.isAdmin) {
                    await Article.deleteOne({ _id: articleId }).exec();
                    res.status(200);
                    res.json({ status: "OK", message: `Delete successful` });
                } else {
                    res.status(401);
                    res.json({
                        status: "FAILED",
                        message: `You dont have permission to delete this article`
                    });
                }
            } else {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: `Article id is invalid`
                });
            }
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "Article id cannot be empty" });
    }
});

router.stack.forEach((r) => {
    if (r.route && r.route.path)
        console.log(JSON.stringify(r.route.methods) + "\t" + "/article" + r.route.path);
});

module.exports = router;
