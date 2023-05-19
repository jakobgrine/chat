import express from "express";
import path from "path";
import { authRouter } from "./api/auth";
import { messagesRouter } from "./api/messages";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "asdlkfjkj123",
    resave: false,
    saveUninitialized: false,
}));

const dist = path.resolve(process.cwd(), "client/dist");
app.use(express.static(dist));

const routes = [
    "/",
    "/login",
];
for (const route of routes) {
    app.get(route, (_, res) => {
        res.sendFile("index.html", { root: dist });
    });
}

app.use("/api/auth", authRouter);
app.use("/api/messages", (req, res, next) => {
    if (req.session.username) {
        next();
        return;
    }
    res.sendStatus(401);
}, messagesRouter);

const port = 8080;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}.`);
});
