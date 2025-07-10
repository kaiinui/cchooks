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
            "command": "bunx ccdont --deny-danger --deny-bash 'rm -rf [prompt user to do that]'"
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
| `--deny-danger` | `ls -la`, `git status`, `git commit` | `rm -rf /`, `dd if=/dev/zero of=/dev/sda`, `git push --force` |

## Dangerous Commands Preset

The `--deny-danger` flag activates a comprehensive preset of dangerous commands that could cause data loss or system damage. This includes:

- **File system destruction**: `rm -rf`, `rm -fr`, etc.
- **Disk operations**: `dd`, `mkfs.*`, `format`, `fdisk`, `parted`
- **Data wiping**: `shred`, `wipefs`, `blkdiscard`
- **Dangerous redirections**: `> /dev/sda`, `> /etc/passwd`, `> /boot/`
- **Fork bombs**: `:(){:|:&};:`
- **Dangerous permissions**: `chmod -R 777`, `chmod -R 000`
- **Package manager dangers**: Force removing critical packages
- **Piping to sudo**: `curl | sudo bash`, `wget -O - | sudo sh`
- **System shutdown**: `shutdown`, `poweroff`, `halt`, `init 0`
- **Database operations**: `DROP DATABASE`, `TRUNCATE TABLE`
- **Network dangers**: Flushing firewall rules
- **Git destructive operations**: 
  - `git push --force` / `git push -f` - Can overwrite remote history
  - `git reset --hard` - Discards all uncommitted changes
  - `git clean -fdx` - Removes all untracked files permanently
  - `git branch -D` - Force deletes branches
  - `git filter-branch` / `git filter-repo` - Rewrites Git history
  - `rm -rf .git` - Deletes entire repository history
  - And more Git operations that can cause data loss
- And many more...

Use `--deny-danger` as a safety net to prevent accidental execution of destructive commands.

You can see the full list here: [danger.ts](https://github.com/kaiinui/cchooks/blob/main/src/danger.ts)

Keep note that `--deny-danger` is not perfectly safe. There are many dangerous cases which is not covered by preset. This option only prevents typical scenarios.