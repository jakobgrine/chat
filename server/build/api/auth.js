"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/login", (req, res, next) => {
    const schema = zod_1.z.object({
        username: zod_1.z.string(),
        password: zod_1.z.string(),
    });
    const result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).send(result.error);
        return;
    }
    const { username, password } = result.data;
    if (password !== "j") {
        res.status(401).send("wrong username or password");
        return;
    }
    req.session.regenerate((error) => {
        if (error) {
            next(error);
        }
        req.session.username = username;
        req.session.save((error) => {
            if (error) {
                next(error);
                return;
            }
            res.status(200).json(req.session);
        });
    });
});
exports.authRouter.post("/logout", (req, res, next) => {
    delete req.session.username;
    req.session.save((error) => {
        if (error) {
            next(error);
        }
        req.session.regenerate((error) => {
            if (error) {
                next(error);
            }
            res.sendStatus(200);
        });
    });
});
exports.authRouter.get("/session", (req, res) => {
    res.json(req.session);
});
