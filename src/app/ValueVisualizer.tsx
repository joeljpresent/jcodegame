import { ExeState } from "./exe/state";
import { toUnicodeChar } from "./utils/unicode";

export default function ValueVisualizer({ exeState }: StepByStepCodeProps) {
  function row(name: string, val: number) {
    return (
      <tr key={name}>
        <td style={{ paddingRight: "1em" }}>{name}</td>
        <td style={{ paddingRight: "1em" }}>{val}</td>
        <td>{toUnicodeChar(val)}</td>
      </tr>
    );
  }

  return (
    <table>
      <tbody>
        {row("cur", exeState.currentValue)}
        {exeState.cells.map((val, idx) => row(`@${idx}`, val))}
      </tbody>
    </table>
  );
}

interface StepByStepCodeProps {
  exeState: ExeState;
}
