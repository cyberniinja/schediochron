#!/usr/bin/env node
// Claude Code Statusline
// Shows: model | directory | context usage

const os = require('os');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const remaining = data.context_window?.remaining_percentage;

    let ctx = '';
    if (remaining != null) {
      const rem = Math.round(remaining);
      const used = Math.max(0, Math.min(100, 100 - rem));
      const filled = Math.floor(used / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m💀 ${bar} ${used}%\x1b[0m`;
      }
    }

    const shortDir = dir.replace(os.homedir(), '~');
    const statusline = `\x1b[36m${model}\x1b[0m | \x1b[90m${shortDir}\x1b[0m${ctx}`;
    process.stdout.write(statusline);
  } catch (e) {
    // Silent fail — don't break statusline on parse errors
  }
});
