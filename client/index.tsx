import { render } from "solid-js/web";
import App from "./src/App";
import "./index.scss";

const root = document.getElementById("root");
if (!(root instanceof HTMLElement)) {
    throw new Error("root element not found");
}

render(() => <App />, root);
