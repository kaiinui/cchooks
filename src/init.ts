import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// ANSI color codes
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

type Hook = {
  type: string;
  command: string;
};

type Matcher = {
  matcher: string;
  hooks: Hook[];
};

type Settings = {
  hooks?: {
    PreToolUse?: Matcher[];
  };
};

const getCommandRunner = (): string => {
  try {
    const result = Bun.spawnSync(["which", "bun"]);
    return result.exitCode === 0 ? "bunx" : "npx";
  } catch {
    return "npx";
  }
};

const getDefaultHook = (): Hook => {
  const runner = getCommandRunner();
  const packageSuffix = runner === "npx" ? "@latest" : "";
  const defaultOptions = "--deny-danger";
  return {
    type: "command",
    command: `${runner} ccdont${packageSuffix} ${defaultOptions}`
  };
};

const DEFAULT_HOOK: Hook = getDefaultHook();

const DEFAULT_MATCHER: Matcher = {
  matcher: "Bash",
  hooks: [DEFAULT_HOOK]
};

export async function initCommand(): Promise<void> {
  const claudeDir = join(process.cwd(), '.claude');
  const settingsPath = join(claudeDir, 'settings.json');

  // Create .claude directory if it doesn't exist
  if (!existsSync(claudeDir)) {
    mkdirSync(claudeDir, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} Created ${colors.bold}.claude${colors.reset} directory`);
  }

  let settings: Settings = {};

  // Read existing settings if file exists
  if (existsSync(settingsPath)) {
    try {
      const file = await Bun.file(settingsPath).text();
      settings = JSON.parse(file);
      console.log(`${colors.blue}ℹ${colors.reset} Found existing ${colors.bold}settings.json${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}✗${colors.reset} Error reading existing settings.json:`, error);
      process.exit(1);
    }
  }

  // Initialize hooks structure if not present
  if (!settings.hooks) {
    settings.hooks = {};
  }
  if (!settings.hooks.PreToolUse) {
    settings.hooks.PreToolUse = [];
  }

  // Check if Bash matcher already exists
  const bashMatcherIndex = settings.hooks.PreToolUse.findIndex(
    matcher => matcher.matcher === "Bash"
  );

  if (bashMatcherIndex === -1) {
    // Add new Bash matcher
    settings.hooks.PreToolUse.push(DEFAULT_MATCHER);
    console.log(`${colors.green}✓${colors.reset} Added ${colors.cyan}ccdont${colors.reset} hooks for Bash commands`);
  } else {
    // Check if our hook already exists
    const existingMatcher = settings.hooks.PreToolUse[bashMatcherIndex];
    if (existingMatcher) {
      const hasOurHook = existingMatcher.hooks.some(
        hook => hook.command && hook.command.includes('ccdont')
      );

      if (!hasOurHook) {
        // Add our hook to existing Bash matcher
        existingMatcher.hooks.push(DEFAULT_HOOK);
        console.log(`${colors.green}✓${colors.reset} Added ${colors.cyan}ccdont${colors.reset} hook to existing Bash matcher`);
      } else {
        console.log(`${colors.yellow}⚡${colors.reset} ${colors.cyan}ccdont${colors.reset} hooks already configured`);
      }
    }
  }

  // Write updated settings
  await Bun.write(settingsPath, JSON.stringify(settings, null, 2));
  console.log(`${colors.green}✓${colors.reset} Settings saved to ${colors.bold}${settingsPath}${colors.reset}`);
  console.log(`\n${colors.cyan}🎉 ccdont is now protecting your Claude Code sessions!${colors.reset}`);
}