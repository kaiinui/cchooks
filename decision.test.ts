import { describe, it, expect } from 'vitest';
import { createDecision, parseDenyRule, type DenyRule } from './decision';

describe('createDecision', () => {
  it('should approve command when no deny rules are provided', () => {
    const decision = createDecision('ls -la', []);
    expect(decision).toEqual({
      decision: 'approve',
      reason: 'OK'
    });
  });

  it('should approve command when it does not match any deny rules', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'rm -rf', message: undefined },
      { pattern: 'sudo', message: undefined }
    ];
    const decision = createDecision('ls -la', denyRules);
    expect(decision).toEqual({
      decision: 'approve',
      reason: 'OK'
    });
  });

  it('should block command with default message when pattern matches', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'rm -rf', message: undefined }
    ];
    const decision = createDecision('rm -rf /tmp', denyRules);
    expect(decision).toEqual({
      decision: 'block',
      reason: 'rm -rf is not allowed to exec'
    });
  });

  it('should block command with custom message when pattern matches', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'bun test', message: "use 'bun run test' instead" }
    ];
    const decision = createDecision('bun test', denyRules);
    expect(decision).toEqual({
      decision: 'block',
      reason: "use 'bun run test' instead"
    });
  });

  it('should block on first matching rule when multiple rules are provided', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'sudo', message: 'requires elevated permissions' },
      { pattern: 'rm -rf', message: 'dangerous command' }
    ];
    const decision = createDecision('sudo rm -rf /', denyRules);
    expect(decision).toEqual({
      decision: 'block',
      reason: 'requires elevated permissions'
    });
  });

  it('should handle partial matches within commands', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'npm install -g', message: 'use local installation' }
    ];
    const decision = createDecision('npm install -g typescript', denyRules);
    expect(decision).toEqual({
      decision: 'block',
      reason: 'use local installation'
    });
  });

  it('should handle empty command', () => {
    const denyRules: DenyRule[] = [
      { pattern: 'test', message: undefined }
    ];
    const decision = createDecision('', denyRules);
    expect(decision).toEqual({
      decision: 'approve',
      reason: 'OK'
    });
  });
});

describe('parseDenyRule', () => {
  it('should parse rule without custom message', () => {
    const rule = parseDenyRule('rm -rf');
    expect(rule).toEqual({
      pattern: 'rm -rf',
      message: undefined
    });
  });

  it('should parse rule with custom message in brackets', () => {
    const rule = parseDenyRule('bun test [use bun run test instead]');
    expect(rule).toEqual({
      pattern: 'bun test',
      message: 'use bun run test instead'
    });
  });

  it('should handle extra spaces in pattern and message', () => {
    const rule = parseDenyRule('  sudo   [  requires elevated permissions  ]');
    expect(rule).toEqual({
      pattern: 'sudo',
      message: 'requires elevated permissions'
    });
  });

  it('should handle brackets within the pattern when no space before brackets', () => {
    const rule = parseDenyRule('echo[test]');
    expect(rule).toEqual({
      pattern: 'echo[test]',
      message: undefined
    });
  });

  it('should handle empty message brackets', () => {
    const rule = parseDenyRule('test []');
    expect(rule).toEqual({
      pattern: 'test []',
      message: undefined
    });
  });

  it('should handle complex patterns with spaces', () => {
    const rule = parseDenyRule('npm install -g [use local installation instead]');
    expect(rule).toEqual({
      pattern: 'npm install -g',
      message: 'use local installation instead'
    });
  });
});