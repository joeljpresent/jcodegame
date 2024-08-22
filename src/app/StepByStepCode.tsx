import { CodeState } from "./execution/state";

export default function StepByStepCode({ codeState }: StepByStepCodeProps) {
  function commandLine(args: string[], idx: number) {
    const isCurrentLine = codeState.lineIdx === idx;
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
    {codeState.commands.map((args, idx) => commandLine(args, idx))}
  </div>;
}

interface StepByStepCodeProps {
  codeState: CodeState;
}
