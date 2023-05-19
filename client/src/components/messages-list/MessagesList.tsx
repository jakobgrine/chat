import { For, createResource, createSignal } from "solid-js";
import { Message } from "../../../../server/db";
import "./MessagesList.scss";

async function fetchMessages(): Promise<Message[]> {
    const response = await fetch("/api/messages");
    return await response.json();
}

export default function MessagesList() {
    const [messages, { mutate: mutateMessages }] = createResource(fetchMessages);

    const events = new EventSource("/api/messages/stream");
    events.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        mutateMessages((previous) => {
            return [
                ...previous,
                message
            ];
        });
    });

    return (
        <div class="scroll-container">
            <div class="messages">
                <For each={messages()}>{(message, i) => (
                    <div class="message">
                        <p class="author">{message.author}</p>
                        <p class="content">{message.content}</p>
                    </div>
                )}</For>
            </div>
        </div>
    );
}
