import { toUnicodeChar } from "./utils/unicode";

export default function ExeInputDisplay({ input, nextInputIdx, isTextMode }: Props) {
  function getValueStyle(idx: number) {
    if (nextInputIdx == null) {
      return;
    } else if (idx === nextInputIdx) {
      return {
        fontWeight: "bold",
        color: "cyan",
      };
    } else if (idx === nextInputIdx - 1) {
      return {
        color: "lime",
      };
    }
  }


  function endDisplay() {
    return (
      <span style={{
        ...getValueStyle(input.length),
        fontSize: "0.6em",
      }}>
        END
      </span>
    );
  }

  if (isTextMode) {
    return (
      <p><pre>
        {
          input.map((v, idx) => (
            <span style={getValueStyle(idx)}>
              {toUnicodeChar(v)}
            </span>
          ))
        }
        {endDisplay()}
      </pre></p>
    );
  }
  return <p>
    {
      input.map((v, idx) => (
        <span style={getValueStyle(idx)}>{v}, </span>
      ))
    }
    {endDisplay()}
  </p>;
}

interface Props {
  input: number[],
  nextInputIdx: number | null,
  isTextMode: boolean,
}