/**
 * usage: bunx cchooks --deny-tool "bun test"
 */

type PreToolUseInput = {
  hook_event_name: string;
  tool_name: string;
  tool_input?: { command?: string };
};

type DecisionOutput = {
  decision: "block" | "approve";
  reason: string;
}

const makeDecision = (type: DecisionOutput["decision"], reason: string) => {
  const output = { decision: type, reason } satisfies DecisionOutput;
  console.log(JSON.stringify(output));
  process.exit(type === "block" ? 2 : 0);
}

const stdin = await Bun.stdin.text();
const data = JSON.parse(stdin) as PreToolUseInput;

if (data.hook_event_name !== "PreToolUse" || data.tool_name !== "Bash") {
  process.exit(0);
}

const cmd = data.tool_input?.command ?? "";
const forbidden = "bun test";

const isViolated = cmd.includes(forbidden);

if (isViolated) {
  makeDecision("block", `${cmd} is forbidden`);
} else {
  makeDecision("approve", "OK");
}