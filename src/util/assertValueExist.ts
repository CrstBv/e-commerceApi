export function assertValueExist<T>(val: T): asserts val is NonNullable<T> {
  if (!val) {
    throw new Error("Expected val but recive" + val);
  }
}
