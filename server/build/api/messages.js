"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const zod_1 = require("zod");
exports.messagesRouter = (0, express_1.Router)();
exports.messagesRouter.get("/", (_, res) => {
    const messages = db_1.db.getMessages();
    res.json(messages);
});
exports.messagesRouter.post("/", (req, res) => {
    const schema = zod_1.z.object({
        message: zod_1.z.string(),
    });
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).send(result.error);
        return;
    }
    db_1.db.insertMessage({
        author: req.session.username,
        content: result.data.message,
    });
});
exports.messagesRouter.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders();
    const onMessage = (message) => {
        const data = JSON.stringify(message);
        res.write(`data:${data}\n\n`);
    };
    db_1.db.on("message", onMessage);
    req.on("close", () => {
        db_1.db.off("message", onMessage);
    });
});
