const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("./models/user");

router.get("/status", async (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn && session.account) {
        try {
            const user = await User.findOne({account: session.account}).exec();
            if (user !== null) {
                res.status(200);
                res.json({
                    status: "OK",
                    message: `Currently logged in as ${user.name}(${user.account})`,
                    user: {
                        id: user.account,
                        name: user.name,
                        isAdmin: user.isAdmin
                    }
                });
            } else {
                res.status(400);
                res.json({ status: "FAILED", message: "Account id not found" });
            }
        } catch (error) {
            res.status(500);
            return next(error);
        }
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "Login session not found" });
    }
});

router.post("/login", async (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "User has already logined" });
        return;
    }
    try {
        const { account, password } = req.body;
        if (account && password) {
            console.log(`[Router] Received login request id=${account}`);
            const result = await User.findOne({
                account: account,
                password: password
            }).exec();

            if (result !== null) {
                session.isLoggedIn = true;
                session.account = result.account;
                session.name = result.name;
                session.isAdmin = result.isAdmin;

                res.status(200);
                res.json({
                    status: "OK",
                    message: "Logined",
                    user: {
                        id: result.account,
                        name: result.name,
                        isAdmin: result.isAdmin
                    }
                });
            } else {
                res.status(401);
                res.json({
                    status: "FAILED",
                    message: "User id or password is invalid"
                });
            }
        } else {
            res.status(400);
            res.json({
                status: "FAILED",
                message: "User id or password is empty"
            });
        }
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

router.post("/register", async (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "User has already logined" });
        return;
    }
    try {
        const { account, name, password } = req.body;
        if (account && name && password) {
            console.log(`[Router] Received user registration with id=${account} name=${name}`);

            const duplicateUser = await User.findById(account).exec();
            if (duplicateUser !== null) {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: "User id has already been taken"
                });
                return;
            }
            const newUser = await new User({
                account: account,
                name: name,
                password: password,
                isAdmin: false
            }).save();

            session.isLoggedIn = true;
            session.account = account;
            session.name = name;
            session.isAdmin = false;

            res.status(200);
            res.json({
                status: "OK",
                message: "Successfully registered and logined",
                user: {
                    account: account,
                    name: name,
                    isAdmin: false
                }
            });
        } else {
            res.status(400);
            res.json({
                status: "FAILED",
                message: "Account id, nickname or password is empty"
            });
        }
    } catch (error) {
        res.status(500);
        return next(error);
    }
});

router.get("/logout", (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        console.log(`[Router] User id=${session.account} has logged out`);
        session.destroy();
        res.status(200);
        res.json({ status: "OK", message: "Successfully logout" });
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "No user has logged in" });
    }
});

router.stack.forEach((r) => {
    if (r.route && r.route.path) console.log(JSON.stringify(r.route.methods) + "\t" + r.route.path);
});

module.exports = router;
