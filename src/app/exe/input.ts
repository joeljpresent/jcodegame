interface ExeInputSuccess {
  status: "success",
  value: number[],
}

interface ExeInputError {
  status: "error",
  error: string,
}

export type ExeInput = ExeInputSuccess | ExeInputError;

export function createInputSuccess(value: number[]): ExeInput {
  return {
    status: "success",
    value,
  };
}

export function createInputError(errorMessage: string): ExeInput {
  return {
    status: "error",
    error: errorMessage,
  };
}
