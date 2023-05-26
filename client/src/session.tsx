import { createResource, createRoot } from "solid-js";
import { SessionData } from "../../server/api/auth";

async function fetchSession(): Promise<Partial<SessionData["user"]>> {
    const response = await fetch("/api/auth/session");
    return await response.json();
}

export default createRoot(() => {
    const [session, { mutate }] = createResource(fetchSession);

    const username = () => session()?.username;
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

    return { username, logOut, loggedIn };
});
