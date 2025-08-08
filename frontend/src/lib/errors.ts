interface ApiError {
  error: string | Record<string, string>;
}

export class ValidationError extends Error {
  fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    super("ValidationError");
    this.fields = fields;
  }
}

export const errorFromResponse = async (response: Response) => {
  try {
    const data = (await response.json()) as ApiError;

    if (response.status === 422 && typeof data.error === "object") {
      return new ValidationError(data.error);
    }

    return new Error(
      typeof data.error === "string" ? data.error : "An unknown error occurred",
    );
  } catch {
    return new Error(`Server error: ${response.statusText}`);
  }
};
