import type { DenyRule } from './decision';

export const DANGEROUS_COMMANDS: DenyRule[] = [
  // File system destruction
  { pattern: "rm -rf", message: "rm -rf can recursively delete files and directories without confirmation" },
  { pattern: "rm -fr", message: "rm -fr can recursively delete files and directories without confirmation" },
  { pattern: "rm -Rf", message: "rm -Rf can recursively delete files and directories without confirmation" },
  { pattern: "rm -fR", message: "rm -fR can recursively delete files and directories without confirmation" },
  
  // Disk operations
  { pattern: "dd if=", message: "dd can overwrite disk data and cause data loss" },
  { pattern: "dd of=", message: "dd can overwrite disk data and cause data loss" },
  { pattern: "mkfs", message: "mkfs formats file systems and will destroy all data" },
  { pattern: "mke2fs", message: "mke2fs creates ext2/3/4 file systems and will destroy all data" },
  { pattern: "mkfs.ext", message: "mkfs.ext* creates ext file systems and will destroy all data" },
  { pattern: "mkfs.xfs", message: "mkfs.xfs creates XFS file systems and will destroy all data" },
  { pattern: "mkfs.btrfs", message: "mkfs.btrfs creates Btrfs file systems and will destroy all data" },
  { pattern: "mkfs.vfat", message: "mkfs.vfat creates FAT file systems and will destroy all data" },
  { pattern: "mkfs.ntfs", message: "mkfs.ntfs creates NTFS file systems and will destroy all data" },
  
  // Partition and disk management
  { pattern: "fdisk", message: "fdisk can modify disk partitions and cause data loss" },
  { pattern: "parted", message: "parted can modify disk partitions and cause data loss" },
  { pattern: "gdisk", message: "gdisk can modify GPT partitions and cause data loss" },
  { pattern: "sfdisk", message: "sfdisk can modify disk partitions and cause data loss" },
  
  // Data wiping
  { pattern: "shred", message: "shred overwrites files to make recovery difficult" },
  { pattern: "wipefs", message: "wipefs can remove filesystem signatures" },
  { pattern: "blkdiscard", message: "blkdiscard can discard device sectors" },
  
  // Dangerous redirections
  { pattern: "> /dev/sda", message: "Writing directly to disk devices can destroy data" },
  { pattern: "> /dev/hd", message: "Writing directly to disk devices can destroy data" },
  { pattern: "> /dev/sd", message: "Writing directly to disk devices can destroy data" },
  { pattern: "> /dev/nvme", message: "Writing directly to disk devices can destroy data" },
  
  // System file modifications
  { pattern: "> /etc/passwd", message: "Modifying system authentication files can lock you out" },
  { pattern: "> /etc/shadow", message: "Modifying system authentication files can lock you out" },
  { pattern: "> /etc/sudoers", message: "Modifying sudo configuration can lock you out of admin access" },
  { pattern: "> /boot/", message: "Modifying boot files can make system unbootable" },
  
  // Fork bombs and resource exhaustion
  { pattern: ":(){:|:&};:", message: "Fork bomb that will crash the system" },
  { pattern: ":(){ :|:& };:", message: "Fork bomb that will crash the system" },
  { pattern: "bomb()", message: "Potential fork bomb or resource exhaustion attack" },
  
  // Dangerous chmod operations
  { pattern: "chmod -R 777", message: "Making everything world-writable is a security risk" },
  { pattern: "chmod 777 /", message: "Making root directory world-writable is extremely dangerous" },
  { pattern: "chmod -R 000", message: "Removing all permissions can make files inaccessible" },
  
  // Dangerous chown operations
  { pattern: "chown -R", message: "Recursive ownership changes can break system permissions" },
  { pattern: "chown root:root /", message: "Changing root directory ownership can break the system" },
  
  // Package manager dangers
  { pattern: "apt-get remove --force", message: "Force removing packages can break dependencies" },
  { pattern: "yum remove -y kernel", message: "Removing kernel packages can make system unbootable" },
  { pattern: "dnf remove -y systemd", message: "Removing systemd will break the system" },
  { pattern: "pacman -Rdd", message: "Removing packages ignoring dependencies can break the system" },
  
  // Dangerous curl/wget operations
  { pattern: "| sudo bash", message: "Piping untrusted scripts to sudo bash is dangerous" },
  { pattern: "| sudo sh", message: "Piping untrusted scripts to sudo sh is dangerous" },
  
  // Memory and system operations
  { pattern: "/dev/mem", message: "Direct memory access can crash the system or expose sensitive data" },
  { pattern: "/dev/kmem", message: "Kernel memory access can crash the system" },
  { pattern: "/dev/port", message: "Direct port access can damage hardware" },
  
  // Dangerous kill operations
  { pattern: "kill -9 -1", message: "Killing all processes can crash the system" },
  { pattern: "killall -9", message: "Force killing all instances of a process can cause instability" },
  { pattern: "pkill -9 -f", message: "Force killing by pattern can terminate critical processes" },
  
  // Infinite loops and hangs
  { pattern: "while true; do", message: "Infinite loops can consume resources" },
  { pattern: "yes | ", message: "Piping yes to commands can cause unexpected behavior" },
  
  // Network dangers
  { pattern: "iptables -F", message: "Flushing firewall rules can expose the system" },
  { pattern: "iptables --flush", message: "Flushing firewall rules can expose the system" },
  { pattern: "ufw disable", message: "Disabling firewall can expose the system" },
  
  // Backup and sync dangers  
  { pattern: "rsync --delete /", message: "Rsync with delete on root can destroy data" },
  { pattern: "tar -czf / ", message: "Creating archives of root filesystem can fill disk" },
  
  // Database operations
  { pattern: "DROP DATABASE", message: "Dropping databases destroys all data" },
  { pattern: "TRUNCATE TABLE", message: "Truncating tables removes all data" },
  { pattern: "mysql -e \"DROP", message: "Database drop commands destroy data" },
  { pattern: "psql -c \"DROP", message: "Database drop commands destroy data" },
  
  // Dangerous find operations
  { pattern: "find / -delete", message: "Finding and deleting from root is dangerous" },
  { pattern: "find / -exec rm", message: "Finding and removing from root is dangerous" },
  { pattern: "find . -delete", message: "Finding and deleting files can remove important data" },
  { pattern: "find / -name \"*\" -exec", message: "Finding and executing commands on all files is dangerous" },
  { pattern: "xargs rm", message: "Piping to xargs rm can delete many files at once" },
  
  // Systemctl dangers
  { pattern: "systemctl stop sshd", message: "Stopping SSH can lock you out of remote systems" },
  { pattern: "systemctl disable sshd", message: "Disabling SSH can lock you out of remote systems" },
  { pattern: "systemctl mask", message: "Masking services can prevent them from starting" },
  
  // Format commands
  { pattern: "format c:", message: "Format commands destroy all data on drives" },
  { pattern: "format /", message: "Format commands destroy all data on drives" },
  
  // Git destructive operations
  { pattern: "git push --force", message: "Force push can overwrite remote history and cause data loss" },
  { pattern: "git push -f", message: "Force push can overwrite remote history and cause data loss" },
  { pattern: "git push --force-with-lease", message: "Force push can overwrite remote history" },
  { pattern: "git reset --hard HEAD", message: "Hard reset discards all uncommitted changes permanently" },
  { pattern: "git reset --hard", message: "Hard reset discards all changes permanently" },
  { pattern: "git clean -fdx", message: "Removes all untracked files and directories permanently" },
  { pattern: "git clean -ffdx", message: "Force removes all untracked files and directories permanently" },
  { pattern: "git branch -D", message: "Force deletes branch and its commits may be lost" },
  { pattern: "git branch --delete --force", message: "Force deletes branch and its commits may be lost" },
  { pattern: "git filter-branch", message: "Rewrites Git history and can cause data loss" },
  { pattern: "git filter-repo", message: "Rewrites Git history and can cause data loss" },
  { pattern: "git rebase -i", message: "Interactive rebase can rewrite history and cause conflicts" },
  { pattern: "git rebase --interactive", message: "Interactive rebase can rewrite history and cause conflicts" },
  { pattern: "git push origin --delete", message: "Deletes remote branch permanently" },
  { pattern: "git push origin :", message: "Deletes remote branch permanently" },
  { pattern: "git reflog expire --expire=now --all", message: "Expires all reflog entries, making recovery impossible" },
  { pattern: "git gc --prune=now", message: "Immediately prunes unreachable objects, making recovery difficult" },
  { pattern: "git remote prune", message: "Removes references to deleted remote branches" },
  { pattern: "git fetch --prune", message: "Removes references to deleted remote branches" },
  { pattern: "git checkout -B", message: "Force creates branch, potentially overwriting existing branch" },
  { pattern: "git merge --abort", message: "Aborts merge and may lose merge resolution work" },
  { pattern: "git rebase --abort", message: "Aborts rebase and may lose rebase work" },
  { pattern: "git cherry-pick --abort", message: "Aborts cherry-pick and may lose work" },
  { pattern: "git stash drop", message: "Permanently deletes stashed changes" },
  { pattern: "git stash clear", message: "Permanently deletes all stashed changes" },
  { pattern: "git update-ref -d", message: "Deletes Git references directly" },
  { pattern: "git symbolic-ref", message: "Can modify Git references in dangerous ways" },
  { pattern: "rm -rf .git", message: "Deletes entire Git repository history" },
  { pattern: "rm .git/index", message: "Deletes Git index, corrupting repository" },
  { pattern: "> .git/", message: "Writing directly to .git directory can corrupt repository" },
  
  // Other dangerous operations
  { pattern: "hdparm", message: "hdparm can modify disk parameters and cause data loss" },
  { pattern: "badblocks -w", message: "Write-mode badblocks testing destroys all data" },
  { pattern: "> /proc/", message: "Writing to /proc can crash or misconfigure the system" },
  { pattern: "> /sys/", message: "Writing to /sys can crash or misconfigure the system" },
  { pattern: "echo 1 > /proc/sys/kernel/sysrq", message: "Enabling SysRq can allow dangerous system operations" },
  { pattern: "init 0", message: "init 0 will shut down the system" },
  { pattern: "shutdown -h now", message: "This will shut down the system immediately" },
  { pattern: "poweroff", message: "This will power off the system" },
  { pattern: "halt", message: "This will halt the system" },
  { pattern: "reboot -f", message: "Force reboot can cause data loss" },
  
  // Additional file operations
  { pattern: "mv / ", message: "Moving root directory can break the system" },
  { pattern: "mv /* ", message: "Moving all root contents can break the system" },
  { pattern: "cp /dev/zero", message: "Copying from /dev/zero can fill disk space" },
  { pattern: "cp /dev/urandom", message: "Copying from /dev/urandom can fill disk space" },
  { pattern: "truncate -s 0", message: "Truncating files to zero size destroys content" },
  
  // Dangerous sed/awk operations
  { pattern: "sed -i '' -e", message: "In-place sed without backup can permanently modify files" },
  { pattern: "sed -i -e", message: "In-place sed without backup can permanently modify files" },
  { pattern: "awk -i inplace", message: "In-place awk can permanently modify files" },
  
  // Homebrew dangers
  { pattern: "brew uninstall --force", message: "Force uninstalling can break dependencies" },
];