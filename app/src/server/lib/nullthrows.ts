export default function nullthrows<T>(x: T | null | undefined): T {
  if (x) {
    return x;
  }
  throw new Error('Got unexpected null or undefined');
}