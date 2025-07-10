#!/usr/bin/env bun

import { Command } from 'commander';
import packageJson from '../package.json';
import { createDecision, parseDenyRule, type DecisionOutput, type DenyRule } from './decision';

type PreToolUseInput = {
  hook_event_name: string;
  tool_name: string;
  tool_input?: { command?: string };
};

const respondWithDecision = (decision: DecisionOutput) => {
  console.log(JSON.stringify(decision));
  process.exit(decision.decision === "block" ? 2 : 0);
}

const program = new Command();

program
  .name('cchook')
  .description('Common hooks for Claude Code')
  .version(packageJson.version || '1.0.0')
  .option('-d, --deny-bash <pattern...>', 'Pattern to deny in commands with optional message: "pattern [message]"')
  .parse(process.argv);

const options = program.opts();
const denyRules: DenyRule[] = (options.denyBash || []).map(parseDenyRule);

const stdin = await Bun.stdin.text();
const data = JSON.parse(stdin) as PreToolUseInput;

if (data.hook_event_name !== "PreToolUse" || data.tool_name !== "Bash") {
  process.exit(0);
}

const cmd = data.tool_input?.command ?? "";
const decision = createDecision(cmd, denyRules);
respondWithDecision(decision);