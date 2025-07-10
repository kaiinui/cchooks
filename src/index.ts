#!/usr/bin/env bun

import { Command } from 'commander';
import packageJson from '../package.json';
import { createDecision, parseDenyRule, type DecisionOutput, type DenyRule } from './decision';
import { DANGEROUS_COMMANDS } from './danger';
import { initCommand } from './init';

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
  .name('ccdont')
  .description('Common deny rules for Claude Code')
  .version(packageJson.version || '1.0.0');

// Init subcommand
program
  .command('init')
  .description('Initialize .claude/settings.json with ccdont hooks')
  .action(async () => {
    await initCommand();
  });

// Default behavior (hook mode)
program
  .command('hook', { isDefault: true })
  .description('Run as a Claude Code hook (default)')
  .option('-d, --deny-bash <pattern...>', 'Pattern to deny in commands with optional message: "pattern [message]"')
  .option('--deny-danger', 'Block dangerous commands like rm -rf, dd, mkfs, etc.')
  .action(async (options) => {
    let denyRules: DenyRule[] = (options.denyBash || []).map(parseDenyRule);

    if (options.denyDanger) {
      denyRules = [...denyRules, ...DANGEROUS_COMMANDS];
    }

    const stdin = await Bun.stdin.text();
    const data = JSON.parse(stdin) as PreToolUseInput;

    if (data.hook_event_name !== "PreToolUse" || data.tool_name !== "Bash") {
      process.exit(0);
    }

    const cmd = data.tool_input?.command ?? "";
    const decision = createDecision(cmd, denyRules);
    respondWithDecision(decision);
  });

program.parse(process.argv);