export type NarrowProperty<T, K extends keyof T, U extends T[K]> = Omit<
  T,
  K
> & {
  [P in K]: U;
};
