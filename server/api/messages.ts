import { Router } from "express";
import { Message, db } from "../db";
import { z } from "zod";

export const messagesRouter = Router();

messagesRouter.get("/", (_, res) => {
    const messages = db.getMessages();
    res.json(messages);
});

messagesRouter.post("/", (req, res) => {
    const schema = z.object({
        message: z.string(),
    });
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).send(result.error);
        return;
    }

    db.insertMessage({
        author: req.session.user!.username,
        content: result.data.message,
    });
});

messagesRouter.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders();

    const onMessage = (message: Message) => {
        const data = JSON.stringify(message);
        res.write(`data:${data}\n\n`);
    };
    db.on("message", onMessage);
    req.on("close", () => {
        db.off("message", onMessage);
    });
});
