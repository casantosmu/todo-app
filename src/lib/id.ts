import { nanoid } from "nanoid";

const ID_LENGTH = 12;

export const generateId = (prefix: string): string => {
  return `${prefix}_${nanoid(ID_LENGTH)}`;
};
