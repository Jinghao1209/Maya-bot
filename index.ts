import express from "express";
import { createServer } from "http";
import Client from "./Class/Client";

const app = express();
const server = createServer(app);
const client = new Client();
client.start();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
