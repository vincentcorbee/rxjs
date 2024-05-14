export const getKeys = (obj: any) =>
  Object.entries(obj).reduce((acc: any, entry: any[]) => {
    const [key, val] = entry;

    Object.defineProperty(acc, key, {
      get() {
        return [key, val];
      },
    });

    return acc;
  }, {});
