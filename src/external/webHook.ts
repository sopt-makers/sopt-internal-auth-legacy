import axios from "axios";

export interface WebHookExternal {
  callOnRegister(data: { userId: number; name: string; generation: number }): Promise<void>;
}

interface WebHookExternalDeps {
  onRegisterTargets: string[];
}

export function createWebHookExternal({ onRegisterTargets }: WebHookExternalDeps): WebHookExternal {
  return {
    async callOnRegister(data) {
      const tasks = onRegisterTargets.map((target) =>
        axios
          .post(target, {
            userId: data.userId,
            name: data.name,
            generation: data.generation,
          })
          .catch(() => {
            //
          }),
      );

      // 의도된 await 없음
      Promise.allSettled(tasks);
    },
  };
}
