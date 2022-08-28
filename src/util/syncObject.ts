export async function syncObject<T extends object>(
  setup: (sync: () => void) => void,
  factory: () => Promise<T>,
): Promise<T> {
  let instance: T = await factory();

  const sync = async () => {
    instance = await factory();
  };

  setup(sync);

  return new Proxy(
    {},
    {
      get(_, prop) {
        return instance[prop as keyof T];
      },
    },
  ) as T;
}
