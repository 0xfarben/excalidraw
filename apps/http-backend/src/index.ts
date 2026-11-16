import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {authMiddleWare} from "./middleware"
import { HTTP_PORT, JWT_SECRET } from "@repo/backend-common/config"

import { UserSignUpSchema, UserSignInSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.get("/", (re, res) => {
    res.send('<h1>Hi there</h1>');
})

app.post("/signup", (req, res) => {
    const { email, password, confirmPassword } = req.body;
    const userId = 1;

    const data = UserSignUpSchema.safeParse({email, password, confirmPassword})

    if ( !data.success ) {
        res.json({
            message: "Incorrect Inputs"
        })
    } 
    
    // async fn. to save the user in database. && 
    // hash the password before saving to database
    // use bcrypt lib.
    // try {

    // } catch (DBSaveError) {

    // }

    // Create JWT Token with the userId && email
    var token = "";
    try {
        token = jwt.sign({userId, email}, JWT_SECRET);
        console.log(token);
        res.json({
            "jwt": token
        })
    } catch (JWTCreationError) {
        console.log(JWTCreationError);
        res.json({
            "Error": JWTCreationError
        });
    }
});

app.post("/signin", authMiddleWare, (req, res) => {
    res.send("<h1>Welcome to Login page</h1>")
});

app.get("/create-room", authMiddleWare, (req, res) => {
    res.send("<h1>Welcome to Create Room page</h1>")
});

app.listen( HTTP_PORT, () => {
    console.log(`Backend URL -> http://localhost:${HTTP_PORT}`)
})