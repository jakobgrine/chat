import { Show, Suspense } from "solid-js";
import session from "./session";
import LoginForm from "./components/login-form/LoginForm";
import "./App.scss";
import MessagesList from "./components/messages-list/MessagesList";
import MessageForm from "./components/message-form/MessageForm";

export default function App() {
    const { username, loggedIn, logOut } = session;

    return (
        <main>
            <Suspense>
                <Show
                    when={loggedIn()}
                    fallback={<LoginForm />}
                >
                    <header>
                        <span>Chat</span>
                        <button onClick={logOut}>Log out ({username()})</button>
                    </header>
                    <MessagesList />

                    <MessageForm />
                </Show>
            </Suspense>
        </main>
    );
};
