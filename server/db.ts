import { EventEmitter } from "events";

export interface Message {
  author: string;
  content: string;
};

class Database extends EventEmitter {
  private data: Message[] = [];

  insertMessage(message: Message) {
    this.data.push(message);
    this.emit("message", message);
  }

  getMessages(): Message[] {
    return this.data;
  }
}

export const db = new Database();
