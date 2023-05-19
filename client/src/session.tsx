import { createResource, createRoot } from "solid-js";
import { SessionData } from "../../server/api/auth";

async function fetchSession(): Promise<Partial<SessionData>> {
    const response = await fetch("/api/auth/session");
    const data = await response.json();
    return data;
}

export default createRoot(() => {
    const [session, { mutate }] = createResource(fetchSession);

    const username = () => session()?.username;
    const logIn = async (username: string, password: string): Promise<string> => {
        const response = await fetch("/api/auth/login", {
            method: "post",
            body: new URLSearchParams({ username, password }),
        });
        if (!response.ok) {
            return response.status === 401
                ? "Wrong username or password"
                : "Failed to log in";
        }

        const session = await response.json();
        mutate(() => session);
    };
    const logOut = async () => {
        const response = await fetch("/api/auth/logout", { method: "post" });
        if (response.ok) {
            mutate((previousSession) => {
                return {
                    ...previousSession,
                    username: undefined,
                };
            });
        }
    };
    const loggedIn = () => Boolean(username());

    return { username, logIn, logOut, loggedIn };
});
