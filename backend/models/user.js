const mongoose = require("mongoose")
const Schema = mongoose.Schema

const User = new Schema(
    {
        account: String,
        name: String,
        password: String,
        isAdmin: Boolean
    }
)

module.exports = mongoose.model("User", User)