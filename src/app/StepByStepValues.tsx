import { ExeState } from "./execution/state";
import { toUnicodeChar } from "./utils";

export default function StepByStepValues({ exeState }: StepByStepCodeProps) {
  function row(name: string, val: number) {
    return (
      <tr>
        <td style={{ paddingRight: "1em" }}>{name}</td>
        <td style={{ paddingRight: "1em" }}>{val}</td>
        <td>{toUnicodeChar(val)}</td>
      </tr>
    );
  }

  return (
    <table>
      {row("cur", exeState.currentValue)}
      {exeState.cells.map((val, idx) => row(`@${idx}`, val))}
    </table>
  );
}

interface StepByStepCodeProps {
  exeState: ExeState;
}
