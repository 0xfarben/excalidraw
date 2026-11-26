import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {authMiddleWare} from "./middleware"
import { HTTP_PORT, JWT_SECRET } from "@repo/backend-common/config"
import { prisma } from "@repo/db/client";

import { UserSignUpSchema, UserSignInSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send('<h1>Hi there</h1>');
})

app.post("/signup", async (req, res) => {
    const parsedData = UserSignUpSchema.safeParse(req.body)

    // Input Validation
    if ( !parsedData.success ) {
        return res.json({
            message: "Incorrect Inputs"
        })
    }

    // check both the passwords
    if ( parsedData.data.password !== parsedData.data.confirmPassword) {
        return res.json({
            message: "Password doesn't match"
        })
    }

    // async fn. to save the user in database. && 
    // hash the password before saving to database
    // using bcrypt lib.
    const { name, email, password } = parsedData.data;
    const normalizedEmail = email.trim().toLowerCase();
    try {
        // hash the password
        const saltRounds = 12;
        const hashPassword = await bcrypt.hash( password , saltRounds)

        // Save user with the HASHED password
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                password: hashPassword
            }
        });

        console.log(`Successful User Creation: ${user.id}`);
        return res.status(201).json({
            userId: user.id
        });
    } catch (error: any) {
        if (error?.code === "P2002") {
            return res.status(409).json({
                message: "A user with this email already exists."
            });
        }

        console.error("Signup Error:", error);
        return res.status(500).json({
            message: "Error saving data in Database. Try again later."
        });
    }
    
});

app.post("/signin", async (req, res) => {
    const parsedData = UserSignInSchema.safeParse(req.body);

    // Input Validation
    if ( !parsedData.success ) {
        return res.status(400).json({
            message: "Incorrect Inputs",
            errors: parsedData.error
        });
    }

    try {   
        // Before any checks, see whether the current email exists in DB or not
        const user = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email.trim().toLowerCase()
            }
        });

        if (!user) {
            return res.status(403).json({
                message: `The user with E-mail ${parsedData.data.email.trim().toLowerCase()} doesn't exist. Please Sign Up`
            });
        }

        // compare the hashed passwords here
        const isMatch = await bcrypt.compare(parsedData.data.password, user.password);
        
        if (!isMatch) {
            return res.status(403).json({
                message: "Password is wrong."
            });
        }

        // Create JWT Token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email 
            }
        , JWT_SECRET );

        return res.json({
            jwt: token
        });

    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({
            message: "Internal server error during signin"
        });
    }
});

app.post("/create-room", authMiddleWare, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    
    // Input Validation
    if ( !parsedData.success ) {
        return res.status(400).json({
            message: "Incorrect Inputs",
            errors: parsedData.error
        });
    }

    try {
        // @ts-ignore
        const userId = req.userId;

        console.log(`User ID: ${userId}`);
    
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.slug,
                adminId: userId
            }
        })

        console.log(`Successful Room Creation: ${room.id}\nSlug:${room.slug}`);
        return res.status(201).json({
            roomId: room.id
        });
    } catch( error ) {
        if (error instanceof Error && error.message.includes("Unique constraint failed")) {
            console.log("Unique constraint failing")
            return res.status(500).json({
                message: "Room already exists"
            })
        }
        console.log(`Create Room Error: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error while creating the room"
        })
    }
});

// old chat messages should come via HTTP layer,
// new messages will come via WebSockets, while saving the chats to DB via Queue.
app.get("/chats/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);

    // take the last 50 messages, and order by latest msg to first.
    try {
        const messages = await prisma.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 50
        })

        res.json({
            messages: messages
        })
    } catch(e) {
        res.json({
            message: "Internal Server Error while fetching the chats"
        })
    }
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;

    try {
        const room = await prisma.room.findFirst({
            where: {
                slug
            }
        })

        res.json({
            room
        })
    } catch(e) {
        res.json({
            message: "Internal Server Error while fetching the chats"
        })
    }
})

app.listen( HTTP_PORT, () => {
    console.log(`Backend URL -> http://localhost:${HTTP_PORT}`)
})