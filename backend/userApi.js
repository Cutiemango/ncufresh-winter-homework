const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("./models/user");

router.get("/status", (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        User.findOne({
            account: session.account,
        }).exec((err, result) => {
            if (err) return next(err);
            if (result !== null) {
                res.status(200);
                res.json({
                    status: "OK",
                    message: `Currently logged in as ${result.name}(${result.account})`,
                    user: {
                        id: result.account,
                        name: result.name,
                        isAdmin: result.isAdmin,
                    },
                });
            } else {
                res.status(400);
                res.json({ status: "FAILED", message: "Account id not found" });
            }
        });
    } else {
        res.status(400);
        res.json({ status: "FAILED", message: "Login session not found" });
    }
});

router.post("/login", (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "User has already logined" });
    } else {
        const { account, password } = req.body;
        if (account && password) {
            console.log(`[Router] Received login request id=${account}`);
            User.findOne({
                account: account,
                password: password,
            }).exec((err, result) => {
                if (err) return next(err);
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
                            isAdmin: result.isAdmin,
                        },
                    });
                } else {
                    res.status(401);
                    res.json({
                        status: "FAILED",
                        message: "User id or password is invalid",
                    });
                }
            });
        } else {
            res.status(400);
            res.json({
                status: "FAILED",
                message: "User id or password is empty",
            });
        }
    }
});

router.post("/register", (req, res, next) => {
    const session = req.session;
    if (session.isLoggedIn) {
        res.status(400);
        res.json({ status: "FAILED", message: "User has already logined" });
    } else {
        const { account, name, password } = req.body;
        if (account && name && password) {
            console.log(
                `[Router] Received user registration with id=${account} name=${name}`
            );
            User.findOne({
                account: account,
            }).exec((err, result) => {
                if (err) return next(err);
                if (result !== null) {
                    res.status(400);
                    res.json({
                        status: "FAILED",
                        message: "User id has already been taken",
                    });
                } else {
                    let newUser = new User({
                        account: account,
                        name: name,
                        password: password,
                        isAdmin: false,
                    }).save((err) => {
                        if (err) return next(err);
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
                                isAdmin: false,
                            },
                        });
                    });
                }
            });
        } else {
            res.status(400);
            res.json({
                status: "FAILED",
                message: "Account id, nickname or password is empty",
            });
        }
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
    if (r.route && r.route.path)
        console.log(JSON.stringify(r.route.methods) + "\t" + r.route.path);
});

module.exports = router;
