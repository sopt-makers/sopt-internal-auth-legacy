import axios from "axios";

import { ServerConfig } from "../config";
import { Notifier } from "./notifier";

export interface WebHookExternal {
  callOnRegister(data: { userId: number; name: string; generation: number }): Promise<void>;
}

interface WebHookExternalDeps {
  config: ServerConfig;
  WEBHOOK_ACCESS_TOKEN: string;
  notifier: Notifier;
}

export function createWebHookExternal({
  config,
  notifier,
  WEBHOOK_ACCESS_TOKEN,
}: WebHookExternalDeps): WebHookExternal {
  return {
    async callOnRegister(data) {
      const onRegisterTargets = await config.get("WEBHOOK_ON_REGISTER");

      const tasks = onRegisterTargets.map((target) =>
        axios
          .post(
            target,
            {
              auth_user_id: data.userId,
              name: data.name,
              generation: data.generation,
            },
            {
              headers: {
                Authorization: `Bearer ${WEBHOOK_ACCESS_TOKEN}`,
              },
            },
          )
          .catch((err) => {
            notifier.notifyError("가입 웹훅 호출에 실패했습니다.", err, { data });
          }),
      );

      // 의도된 await 없음
      Promise.allSettled(tasks);
    },
  };
}
