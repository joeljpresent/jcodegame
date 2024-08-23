import { ExeState } from "./exe/state";

export default function ScriptVisualizer({ exeState }: Props) {
  function getLineStyle(idx: number) {
    if (idx === exeState.lineIdx) {
      return {
        fontWeight: "bold",
        color: "cyan",
      };
    } else if (idx === exeState.previousLineIdx) {
      return {
        color: "lime",
      };
    }
  }

  function commandLine(args: string[], idx: number) {
    return (
      <p style={getLineStyle(idx)}>
        [{idx + 1}] {args.join(" ")}
      </p>
    );
  }

  return <div>
    {exeState.commands.map((args, idx) => commandLine(args, idx))}
  </div>;
}

interface Props {
  exeState: ExeState;
}
