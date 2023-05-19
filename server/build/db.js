"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const events_1 = require("events");
;
class Database extends events_1.EventEmitter {
    data = [];
    insertMessage(message) {
        this.data.push(message);
        this.emit("message", message);
    }
    getMessages() {
        return this.data;
    }
}
exports.db = new Database();
