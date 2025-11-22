"use client";

export interface ExeError {
  lineNumber: number;
  msg: string;
}

export function isExeError(v: unknown): v is ExeError {
  return v != null && typeof v === "object"
    && Object.hasOwn(v, "lineNumber")
    && Object.hasOwn(v, "msg");
}
