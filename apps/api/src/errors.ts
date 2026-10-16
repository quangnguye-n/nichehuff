export type ErrorCode = "unauthorized" | "not_implemented";

export type ErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
  };
};

export function errorBody(code: ErrorCode, message: string): ErrorBody {
  return { error: { code, message } };
}
