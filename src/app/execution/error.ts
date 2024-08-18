"use client";

export interface CodeError {
    lineNumber: number;
    msg: string;
  }

  export function isCodeError(v: unknown): v is CodeError {
    return v != null && typeof v === "object"
      && Object.hasOwn(v, "lineNumber")
      && Object.hasOwn(v, "msg");
  }
