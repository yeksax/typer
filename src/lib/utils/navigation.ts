import { goto } from "$app/navigation";

class Router {
  public history: string[];

  constructor() {
    this.history = [];
  }

  register(url: string) {
    if (this.history.at(-1) != url) this.history.push(url);
  }

  push(url: string) {
    goto(url);
    this.history.push(url);
  }

  back() {
    if (this.history.length > 1) {
      this.history.pop();
      goto(this.history[this.history.length - 1]);
    } else {
      goto("/");
    }
  }
}

export const router = new Router();
