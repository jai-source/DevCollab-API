import express from "express";
const app = express();

app.get("/",(req,res) => {
    res.send("DevCollab API running");
});

export default app;