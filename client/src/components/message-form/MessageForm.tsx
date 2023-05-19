import "./MessageForm.scss";

export default function MessageForm() {
    return (
        <form id="message-form" onSubmit={async (event) => {
            event.preventDefault();

            const data = new FormData(event.currentTarget);
            event.currentTarget.reset();

            const message = data.get("message") as string;
            await fetch("/api/messages", {
                method: "post",
                body: JSON.stringify({ message }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }}>
            <input type="text" class="grow" name="message" id="message-input" required autofocus />
            <button type="submit">Send</button>
        </form>
    );
};