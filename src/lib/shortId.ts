/**
 * Generates a unique, sortable, and simple ID.
 * Combines a hexadecimal timestamp with a random number, also in hexadecimal.
 */
export default function shortId() {
  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, "0");
  const random = crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16)
    .padStart(8, "0");
  return `${timestamp}${random}`;
}
