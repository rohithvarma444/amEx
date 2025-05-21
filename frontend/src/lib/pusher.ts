// src/lib/pusher.ts
// -----------------------------------------------------------
// Tell TypeScript that a cached Pusher instance may live on
// globalThis so we don’t recreate it every hot-reload.
// -----------------------------------------------------------
import type Pusher from "pusher";

declare global {
  // eslint-disable-next-line no-var
  var _pusher: Pusher | undefined;
}

export {};

import PusherServer from "pusher";

// ✅ Re-use the instance if it already exists (dev hot-reload safe)
const pusher =
  global._pusher ??
  (global._pusher = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  }));

export default pusher;