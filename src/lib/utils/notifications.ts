import { browser } from "$app/environment";
import axios from "axios";

export async function readAll() {
  if (browser) {
    await axios.post("/api/notifications/read");
  }
}
