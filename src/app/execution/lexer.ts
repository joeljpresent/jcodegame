"use client";

import { CodeError, isCodeError } from "./runner";

function isWhiteSpace(char: string) {
  return [" ", "\t", "\r"].includes(char);
}

export function lexScript(script: string): string[][] | CodeError {
  try {
    return script.split("\n").map((line, lineIdx) => {
      function err(msg: string) {
        return {
          lineNumber: lineIdx + 1,
          msg: `Lexing error: ${msg}`,
        } as CodeError;
      };

      let idx = 0;
      const tokens: string[] = [];
      while (idx < line.length) {
        if (isWhiteSpace(line[idx])) {
          idx += 1;
        } else if (/^[\w@&-]$/.test(line[idx])) {
          let token = line[idx];
          idx += 1;
          while (/^\w$/.test(line[idx])) {
            token += line[idx];
            idx += 1;
          }
          if (line[idx] != null && !isWhiteSpace(line[idx])) {
            throw err(`token “${token}” must be followed by whitespace or end of line`);
          }
          tokens.push(token);
        } else if (line[idx] === "'") {
          let token = "'";
          idx += 1;
          while (line[idx] !== "'") {
            token += line[idx];
            if (line[idx] === "\\") {
              idx += 1;
              token += line[idx];
            }
            idx += 1;
          }
          if (line[idx] != "'") {
            throw err(`invalid character literal: “${token}”`);
          }
          token += "'";
          tokens.push(token);
          idx += 1;
          if (line[idx] != null && !isWhiteSpace(line[idx])) {
            throw err(`character literal “${token}” must be followed by whitespace or end of line`);
          }
        } else if (line[idx] === "#") {
          return tokens;
        } else {
          throw err(`invalid character: “${line[idx]}”`);
        }
      }
      return tokens;
    });
  } catch (e: unknown) {
    if (isCodeError(e)) {
      return e;
    }
    return {
      lineNumber: -1,
      msg: String(e),
    }
  }
}
