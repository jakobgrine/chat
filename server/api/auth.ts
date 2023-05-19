import { Router } from "express";
import { z } from "zod";
import { SessionData } from "express-session";

declare module "express-session" {
    interface SessionData {
        username: string;
    }
}

export { type SessionData };

export const authRouter = Router();

authRouter.post("/login", (req, res, next) => {
    const schema = z.object({
        username: z.string(),
        password: z.string(),
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

authRouter.post("/logout", (req, res, next) => {
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

authRouter.get("/session", (req, res) => {
    res.json(req.session);
});
