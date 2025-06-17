import { nanoid } from "nanoid";

export default function shortId(prefix: string) {
  return `${prefix}_${nanoid(12)}`;
}
