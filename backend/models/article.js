const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Article = new Schema(
    {
        authorId: String,
        authorName: String,
        content: String,
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        postTimeStamp: Date
    }
)

module.exports = mongoose.model("Article", Article)