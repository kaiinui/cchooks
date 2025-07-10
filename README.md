# cchooks

**cchooks** provides simple, pre-defined hooks that block dangerous shell commands and return helpful feedback to Claude Code.

## Why use cchooks?

* **Readable hooks** – Writing complex patterns in `jq` or `bash` can be hard to maintain.
  cchooks lets you describe them declaratively in JSON.
* **Targeted denial** – Block only the exact commands (or patterns) you care about, instead of every shell invocation.

## Installation

Add the following snippet to `./.claude/settings.json`:

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

## Example Configurations

You can configure which commands to deny using `--deny-bash` as many as you want.

| Option                                                       | ✅ Allowed                            | 🚫 Blocked                                                             |
| :----------------------------------------------------------- | :----------------------------------- | :--------------------------------------------------------------------- |
| `--deny-bash 'rm --rf'`                                      | `rm foo.md`                          | `rm --rf ~/`                                                           |
| `--deny-bash 'bun test [use bun run test instead]'`          | `bun run test`                       | `bun test` <br>*(💡 Hint shown: “use bun run test instead”)*           |
| `--deny-bash 'bun test' --deny-bash 'npm [use bun instead]'` | `bun run index.ts`                   | `bun test`, `npm install foo` <br>*(💡 Hint shown: “use bun instead”)* |
| `--deny-danger`                                              | `ls -la`, `git status`, `git commit` | `rm -rf /`, `dd if=/dev/zero of=/dev/sda`, `git push --force`          |

## `--deny-danger` preset

Enabling `--deny-danger` activates a thorough list of high-risk commands, protecting you from accidents that could wipe data or corrupt a system.

### What it blocks

* **File-system destruction** – `rm -rf`, `rm -fr`, …
* **Raw disk operations** – `dd`, `mkfs.*`, `fdisk`, `parted`, `format`, …
* **Data-wipe utilities** – `shred`, `wipefs`, `blkdiscard`
* **Dangerous redirections** – e.g. `> /dev/sda`, `> /etc/passwd`, `> /boot/`
* **Fork bombs** – `:(){ :|:& };:`
* **Extreme permission changes** – `chmod -R 777`, `chmod -R 000`
* **Package-manager pitfalls** – Removing critical system packages with `--force`, `--no-scripts`, etc.
* **Pipeline-to-root** – `curl | sudo bash`, `wget -O - | sudo sh`
* **System shutdowns** – `shutdown`, `poweroff`, `halt`, `init 0`
* **Destructive SQL** – `DROP DATABASE`, `TRUNCATE TABLE`
* **Firewall flushes** – wiping all iptables/nftables rules
* **Hazardous Git actions**

  * `git push --force` / `git push -f` – overwrites remote history
  * `git reset --hard` – discards all local changes
  * `git clean -fdx` – permanently deletes untracked files
  * `git branch -D` – force-deletes branches
  * `git filter-branch`, `git filter-repo` – rewrites history
  * `rm -rf .git` – erases the repository
  * *…and many similar commands*

Use the preset as a safety net—but remember it can’t cover every edge case.

You can inspect the full list here: [`danger.ts`](https://github.com/kaiinui/cchooks/blob/main/src/danger.ts).

> **Note**
> The preset greatly reduces risk, yet it’s not fool-proof. Always review your hooks and add extra patterns for project-specific threats.

---

Happy (and safer) hacking!
