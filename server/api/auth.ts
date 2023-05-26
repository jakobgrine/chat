import { Router } from "express";
import { SessionData } from "express-session";
import { OAuth2 } from "oauth";
import axios from "axios";
import config from "../../config.json";

declare module "express-session" {
    interface SessionData {
        user: {
            username: string;
        };
        accessToken: string;
        refreshToken: string;
    }
}

export { type SessionData };

const oauth = new OAuth2(
    config["oauth_client_id"],
    config["oauth_client_secret"],
    "https://github.com",
    "/login/oauth/authorize",
    "/login/oauth/access_token",
);

export const authRouter = Router();

authRouter.get("/login", (_, res) => {
    const authUrl = oauth.getAuthorizeUrl({
        "redirect_uri": "http://localhost:8080/api/auth/callback",
        scope: ["read:user"],
        state: config["oauth_state"],
    });
    res.redirect(authUrl);
});

authRouter.get("/callback", (req, res, next) => {
    if (req.query.state !== config["oauth_state"]) {
        res.status(400).send("oauth state mismatch");
        return;
    }

    if (req.query.error) {
        res.sendStatus(418);
        return;
    }

    const code = req.query.code;
    if (typeof code !== "string") {
        res.status(400).send("invalid code");
        return;
    }

    oauth.getOAuthAccessToken(
        code,
        {
            "redirect_uri": "http://localhost:8080/api/auth/callback",
        },
        (error, accessToken, refreshToken, results) => {
            if (error) {
                next(error);
                return;
            }
            if (results.error) {
                next(results.error);
                return;
            }

            req.session.regenerate((error) => {
                if (error) {
                    next(error);
                    return;
                }

                req.session.accessToken = accessToken;
                req.session.refreshToken = refreshToken;

                axios.get("https://api.github.com/user", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                }).then((response) => {
                    req.session.user = {
                        username: response.data.login,
                    };

                    req.session.save((error) => {
                        if (error) {
                            next(error);
                            return;
                        }

                        res.redirect("/");
                    });
                }).catch((error) => {
                    next(error);
                });
            });
        },
    );
});

authRouter.post("/logout", (req, res, next) => {
    req.session.regenerate((error) => {
        if (error) {
            next(error);
            return;
        }

        req.session.destroy((error) => {
            if (error) {
                next(error);
                return;
            }

            res.sendStatus(200);
        });
    });
});

authRouter.get("/session", (req, res) => {
    res.json(req.session.user || {});
});
