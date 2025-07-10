# cchooks

Simple pre-defined hooks to disallow specific commands and gives meaningful feedback to Claude Code.

## Why?

* Writing hooks in `jq` and `bash` are not human readable.
* You might only want to deny few specific command patterns.

## Installation

Add folllowing JSON to `./.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bunx ccdont --deny-bash 'rm -rf [prompt user to do that]'"
          }
        ]
      }
    ]
  }
}
```

## Example

| options | ⭕️ allowed | ✖️ blocked |
|:---|:---|:---|
| `--deny-bash 'rm --rf'` | `rm foo.md` | `rm --rf ~/` |
| `--deny-bash 'bun test [use bun run test instead]'` | `bun run test` | `bun test` (📝 use bun run test instead) |
| `--deny-bash 'bun test' --deny-bash 'npm [use bun instead]'` | `bun run index.ts` | `bun test`, `npm install foo` (📝 use bun instead) |