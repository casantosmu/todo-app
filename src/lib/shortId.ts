/**
 * Generates a short, random 8-character hexadecimal ID.
 */
export default function shortId() {
  return crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString(16)
    .padStart(8, "0");
}
