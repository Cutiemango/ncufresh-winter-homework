const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Comment = new Schema(
    {
        articleId: String,
        authorId: String,
        authorName: String,
        content: String,
        postTimeStamp: Date
    }
)

module.exports = mongoose.model("Comment", Comment)