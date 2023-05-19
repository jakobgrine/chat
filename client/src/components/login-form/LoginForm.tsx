import "./LoginForm.scss";
import session from "../../session";
import { Show, createSignal } from "solid-js";

export default function LoginForm() {
    const [failed, setFailed] = createSignal("");

    return (
        <>
            <h1>Log in</h1>
            <form id="login-form" onSubmit={async (event) => {
                event.preventDefault();

                const data = new FormData(event.currentTarget);
                const error = await session.logIn(
                    data.get("username") as string,
                    data.get("password") as string,
                );
                setFailed(error);
            }}>
                <div class="entry">
                    <label for="username-input">Username</label>
                    <input type="text" name="username" id="username-input" required autofocus />
                </div>

                <div class="entry">
                    <label for="password-input">Password</label>
                    <input type="password" name="password" id="password-input" required />
                </div>

                <Show when={failed()}>
                    <span class="error">{failed()}</span>
                </Show>

                <button type="submit">Log in</button>
            </form>
        </>
    );
};
