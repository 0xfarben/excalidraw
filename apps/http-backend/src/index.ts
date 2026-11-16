import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();

app.get("/", (re, res) => {
    res.send('<h1>Hi there</h1>');
})

app.listen( PORT, () => {
    console.log(`Backend URL -> http://localhost:${PORT}`)
})