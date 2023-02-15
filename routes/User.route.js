const express = require("express")
const { UserModel } = require("../models/User.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, pass, age } = req.body

    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                console.log(err)
            } else {
                const user = new UserModel({ name, email, pass: hash, age });
                await user.save()
                res.send("Registered")
            }
        });

    } catch (err) {
        res.send("Error in registering the user")
        console.log(err);
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    try {
        const user = await UserModel.find({ email })
        const hashed_pass = user[0].pass
        if (user.length > 0) {
            bcrypt.compare(pass, hashed_pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID: user[0].id }, process.env.key)
                    res.send({ "msg": "login successful", "token": token })
                } else {
                    res.send("Wrong credentials")
                }
            });
        } else {
            res.send("Wrong credentials")
        }
    } catch (err) {
        res.send("Something went wrong")
        console.log(err);
    }
})

module.exports = {
    userRouter
}