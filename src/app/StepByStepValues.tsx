import { CodeState } from "./execution/state";
import { toUnicodeChar } from "./utils";

export default function StepByStepValues({ codeState }: StepByStepCodeProps) {
  function row(name: string, val: number) {
    return (
    <tr>
      <td style={{paddingRight: "1em"}}>{name}</td>
      <td style={{paddingRight: "1em"}}>{val}</td>
      <td>{toUnicodeChar(val)}</td>
    </tr>
    );
  }

  return (
    <table>
      {row("cur", codeState.currentValue)}
      {codeState.cells.map((val, idx) => row(`@${idx}`, val))}
    </table>
  );
}

interface StepByStepCodeProps {
  codeState: CodeState;
}
