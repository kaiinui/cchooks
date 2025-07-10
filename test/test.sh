#!/bin/bash

# Test script for cchooks CLI

echo "=== Testing cchooks with various inputs ==="
echo

# Test 1: Block command with deny pattern
echo "Test 1: Blocking 'rm -rf /' with --deny-bash 'rm -rf'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "rm -rf /"}}' | bun run index.ts --deny-bash "rm -rf"
echo "Exit code: $?"
echo

# Test 2: Approve command that doesn't match pattern
echo "Test 2: Approving 'ls -la' with --deny-bash 'rm -rf'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "ls -la"}}' | bun run index.ts --deny-bash "rm -rf"
echo "Exit code: $?"
echo

# Test 3: Non-Bash tool (should exit with 0)
echo "Test 3: Non-Bash tool should be ignored"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Python", "tool_input": {"command": "print(\"hello\")"}}' | bun run index.ts --deny-bash "print"
echo "Exit code: $?"
echo

# Test 4: Non-PreToolUse event (should exit with 0)
echo "Test 4: Non-PreToolUse event should be ignored"
echo '{"hook_event_name": "PostToolUse", "tool_name": "Bash", "tool_input": {"command": "echo test"}}' | bun run index.ts --deny-bash "echo"
echo "Exit code: $?"
echo

# Test 5: Multiple forbidden patterns
echo "Test 5: Blocking 'sudo rm -rf /' with --deny-bash 'sudo'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "sudo rm -rf /"}}' | bun dev --deny-bash "sudo"
echo "Exit code: $?"
echo

# Test 6: Empty command
echo "Test 6: Empty command should be approved"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": ""}}' | bun dev --deny-bash "test"
echo "Exit code: $?"
echo

# Test 7: Missing command field
echo "Test 7: Missing command field should be approved"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {}}' | bun dev --deny-bash "test"
echo "Exit code: $?"
echo

# Test 8: Multiple deny patterns (should block)
echo "Test 8: Multiple deny patterns - blocking 'sudo rm -rf'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "sudo rm -rf /tmp"}}' | bun dev --deny-bash "rm -rf" --deny-bash "sudo" --deny-bash "chmod"
echo "Exit code: $?"
echo

# Test 9: Multiple deny patterns (should approve)
echo "Test 9: Multiple deny patterns - approving 'ls -la'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "ls -la"}}' | bun dev --deny-bash "rm -rf" --deny-bash "sudo" --deny-bash "chmod"
echo "Exit code: $?"
echo

# Test 10: Testing which pattern matches
echo "Test 10: Testing pattern matching order"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "chmod 777 file.txt"}}' | bun dev --deny-bash "rm -rf" --deny-bash "sudo" --deny-bash "chmod"
echo "Exit code: $?"
echo

# Test 11: Custom message with square brackets
echo "Test 11: Custom message - 'bun test' with suggestion"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "bun test"}}' | bun dev --deny-bash "bun test [use 'bun run test' instead]"
echo "Exit code: $?"
echo

# Test 12: Pattern without custom message (default message)
echo "Test 12: Default message for 'rm -rf'"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "rm -rf /tmp"}}' | bun dev --deny-bash "rm -rf"
echo "Exit code: $?"
echo

# Test 13: Multiple patterns with mixed messages
echo "Test 13: Multiple patterns with mixed custom and default messages"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "sudo apt-get install"}}' | bun dev --deny-bash "sudo [requires elevated permissions]" --deny-bash "rm -rf" --deny-bash "chmod [dangerous permission change]"
echo "Exit code: $?"
echo

# Test 14: Pattern with spaces and custom message
echo "Test 14: Pattern with spaces and custom message"
echo '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "tool_input": {"command": "npm install -g"}}' | bun dev --deny-bash "npm install -g [use local installation instead]"
echo "Exit code: $?"
echo

echo "=== Testing complete ==="