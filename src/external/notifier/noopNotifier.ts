import { Notifier } from "./types";

const noopFunc = () => {
  //
};

export const noopNotifier: Notifier = new Proxy(
  {},
  {
    get() {
      return noopFunc;
    },
  },
) as Notifier;
