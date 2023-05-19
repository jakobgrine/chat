"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("./api/auth");
const messages_1 = require("./api/messages");
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: "asdlkfjkj123",
    resave: false,
    saveUninitialized: false,
}));
const dist = path_1.default.resolve(process.cwd(), "client/dist");
app.use(express_1.default.static(dist));
const routes = [
    "/",
    "/login",
];
for (const route of routes) {
    app.get(route, (_, res) => {
        res.sendFile("index.html", { root: dist });
    });
}
app.use("/api/auth", auth_1.authRouter);
app.use("/api/messages", (req, res, next) => {
    if (req.session.username) {
        next();
        return;
    }
    res.sendStatus(401);
}, messages_1.messagesRouter);
const port = 8080;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}.`);
});
