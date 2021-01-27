const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const userApi = require("./userApi");
const articleApi = require("./articleApi");
const commentApi = require("./commentApi");

const API_PORT = 3001;
const DB_ROUTE = "mongodb://localhost:27017";
const DB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

const app = express();
mongoose.connect(`${DB_ROUTE}/ncufresh-winter-homework`, DB_OPTIONS);
const conn = mongoose.connection;

conn.once("open", () => {
    console.log("[Mongoose] Connected to the database!");
});
conn.on("error", console.error.bind(console, "[Mongoose] [Error] MongoDB connection error: "));

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["POST", "GET", "DELETE"],
        credentials: true
    })
);

app.use(
    session({
        secret: "peko",
        saveUninitialized: false, // don't create session until something stored
        resave: true, // save session even if no data is modified
        store: new MongoStore({
            mongooseConnection: conn,
            collection: "sessions",
            touchAfter: 24 * 3600 // time period in seconds
            /*
             * By setting touchAfter: 24 * 3600, you are asking the session to be updated only one time in a period of 24 hours.
             * Does not matter how many request's are made. (with the exception of those that change something on the session data)
             */
        }),
        cookie: {
            maxAge: 600 * 1000 // the cookie lives for 10 mins
        }
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use("/", userApi);
app.use("/article", articleApi);
app.use("/comment", commentApi);

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ message: err.message });
    if (err.status !== 404) {
        console.log(`[Express] Encountered an error with status code ${err.status}`);
        console.log(err.message);
    }
});

app.listen(API_PORT, () => console.log(`[Express] Listening on port ${API_PORT}`));

module.exports = app;
