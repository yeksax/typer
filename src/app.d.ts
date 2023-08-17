// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      pusher: import("pusher");
    }

    interface PageData {
      title?:
        | string
        | {
            absolute: string;
          };
      path?: string[];
    }
    // interface Platform {}
  }
}

export {};
