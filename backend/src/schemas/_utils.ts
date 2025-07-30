import { Type, type TSchema } from "@sinclair/typebox";

/**
 * A shorthand helper to make a given TypeBox schema nullable.
 */
export const TypeNull = <T extends TSchema>(type: T) =>
  Type.Union([type, Type.Null()]);

/**
 * Creates a schema for values that can be a `number` or `bigint`.
 * This works around JSON's lack of native `bigint` support by transporting
 * large integers as strings, which prevents precision loss and serialization errors.
 */
export const TypeNumeric = () =>
  Type.Unsafe<number | bigint>(
    Type.Transform(
      Type.Union([Type.Number(), Type.String({ pattern: "^[+-]?\\d+$" })]),
    )
      .Decode((value) => (typeof value === "string" ? BigInt(value) : value))
      .Encode((value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
  );
