import * as fs from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

type HookInput = {
  session_id: string;
  transcript_path: string;
  hook_event_name: "Notification";
  message: string;
};

function extractLastUserPrompt(transcriptPath: string): string | null {
  try {
    const data = fs.readFileSync(transcriptPath, 'utf8').trimEnd();
    const lines = data.split('\n').reverse();
    
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        if (obj?.type === 'user' || obj?.message?.role === 'user') {
          const content = obj.message?.content ?? obj.message?.text;
          if (typeof content === 'string') return content;
          if (Array.isArray(content)) {
            const block = content.find((b: any) => b.type === 'text');
            if (block?.text) return block.text;
          }
        }
      } catch {
        // パース失敗は無視
      }
    }
  } catch (error) {
    console.error('Error reading transcript:', error);
  }
  return null;
}

export async function handleNotification() {
  const inputData = await Bun.stdin.text();
  const payload = JSON.parse(inputData) as HookInput;
  const lastUserMessage = extractLastUserPrompt(payload.transcript_path);
  const prompt = lastUserMessage ? `Task completed: ${lastUserMessage}` : 'Task completed';
  const preview = prompt.replace(/\s+/g, ' ').slice(0, 120);
  const src = resolve(__dirname, 'claude-code-icon.png');
  
  try {
    execSync(`terminal-notifier -title "Claude Code" -message "${preview}" -appIcon ${src}`, {
      stdio: 'ignore'
    });
  } catch (notifyError) {
    console.error('terminal-notifier not found. Please install it with: brew install terminal-notifier');
  }
}