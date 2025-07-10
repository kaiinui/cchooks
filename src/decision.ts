export type DecisionOutput = {
  decision: "block" | "approve";
  reason: string;
}

export type DenyRule = {
  pattern: string;
  message?: string;
};

export function createDecision(cmd: string, denyRules: DenyRule[]): DecisionOutput {
  const violatedRule = denyRules.find(rule => cmd.includes(rule.pattern));
  
  if (violatedRule) {
    const message = violatedRule.message 
      ? `Command "${cmd}" is not allowed: ${violatedRule.message}`
      : `Command "${cmd}" is not allowed.`;
    return { decision: "block", reason: message };
  } else {
    return { decision: "approve", reason: "OK" };
  }
}

export function parseDenyRule(rule: string): DenyRule {
  // Match pattern with message in format: "pattern [message]"
  // The message part must have at least one non-whitespace character
  const match = rule.match(/^(.+?)\s+\[(.+)\]$/);
  if (match && match[1] && match[2] && match[2].trim()) {
    return {
      pattern: match[1].trim(),
      message: match[2].trim(),
    };
  }
  return {
    pattern: rule,
    message: undefined
  };
}