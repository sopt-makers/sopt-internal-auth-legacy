import readline from "readline";

import { createTokenClient } from "../src/lib/token";

const TEST_SECRET = "<TEST_SECRET>";
const TEST_ORIGIN = "TEST_ORIGIN";

async function main() {
  const stdin = createStdin();

  const tokenClient = createTokenClient({ jwtSecret: TEST_SECRET, origin: TEST_ORIGIN });

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const userId = await stdin.readInt("테스트 User ID: ");
    const token = await tokenClient.createAuthToken({ userId });

    console.log(token);
  }
}

main();

function createStdin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  const obj = {
    async readLine(query: string) {
      return new Promise<string>((resolve) => {
        rl.question(query, (ans) => resolve(ans));
      });
    },
    async readInt(query: string) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const raw = await obj.readLine(query);
        const num = parseInt(raw, 10);
        if (!isNaN(num)) {
          return num;
        }
      }
    },
  };

  return obj;
}
