import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin
} from "matrix-bot-sdk";
import { inspectMessageForAddresses } from "./validator";

const homeserverUrl = process.env.MATRIX_HOMESERVER_URL || "https://matrix.org";
const accessToken = process.env.MATRIX_ACCESS_TOKEN || "";

async function main() {
  if (!accessToken) {
    console.error("Error: MATRIX_ACCESS_TOKEN environment variable is required.");
    process.exit(1);
  }

  const storage = new SimpleFsStorageProvider("bot-storage.json");
  const client = new MatrixClient(homeserverUrl, accessToken, storage);
  AutojoinRoomsMixin.setupOnClient(client);

  client.on("room.message", async (roomId: string, event: any) => {
    if (!event?.content || event.content.msgtype !== "m.text") return;
    const sender = event.sender;
    const botUserId = await client.getUserId();
    if (sender === botUserId) return;

    const body: string = event.content.body || "";
    const findings = inspectMessageForAddresses(body);

    for (const item of findings) {
      if (item.warning) {
        await client.sendNotice(roomId, `⚠️ [CryptoGuard] ${item.warning}`);
      }
    }
  });

  await client.start();
  console.log("Matrix Crypto Guard Bot started and listening for room messages...");
}

main().catch((err) => {
  console.error("Fatal bot error:", err);
  process.exit(1);
});
