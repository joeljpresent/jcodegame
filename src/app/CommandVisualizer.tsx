import { ExeState } from "./execution/state";

export default function CommandVisualizer({ exeState }: Props) {
  function commandLine(args: string[], idx: number) {
    const isCurrentLine = exeState.lineIdx === idx;
    return (
      <p style={{
        fontWeight: isCurrentLine ? "bold" : undefined,
        color: isCurrentLine ? "cyan" : undefined,
      }}>
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
