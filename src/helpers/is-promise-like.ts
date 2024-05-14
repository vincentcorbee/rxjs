export const isPromiseLike = <T>(obj: any): boolean => {
  if (!obj) return false;

  if (obj instanceof Promise) return true;

  if (typeof (obj as PromiseLike<T>).then === 'function') return true;

  return false;
};
