import { nanoid } from "nanoid";

const ID_LENGTH = 12;

export const generateId = (): string => {
  return nanoid(ID_LENGTH);
};
