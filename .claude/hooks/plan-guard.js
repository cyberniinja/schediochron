#!/usr/bin/env node

// Plan Guard - PreToolUse Hook
// Prevents Claude from writing source files during planning phases.
//
// Planning phases: /comprehend-issue (Phase 1), /plan-issue (Phase 2)
// Activated by: .agents/.planning-active marker file
// Deactivated by: /implement-issue (removes marker), 4-hour TTL, or /unlock
//
// During planning:
//   - Only Explore sub-agents are allowed (Task tool)
//   - Writes/Edits must stay inside .agents/issues/{issue-folder}/
//   - File-writing Bash commands are blocked

const fs = require('fs');
const path = require('path');

const LOCK_FILE = path.join('.agents', '.planning-active');
const ISSUES_DIR = path.join('.agents', 'issues');
const LOCK_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

function isPlanningActive(workspaceDir) {
  const lockPath = path.resolve(workspaceDir, LOCK_FILE);
  if (!fs.existsSync(lockPath)) return false;

  try {
    const stat = fs.statSync(lockPath);
    const age = Date.now() - stat.mtimeMs;
    if (age > LOCK_TTL_MS) {
      fs.unlinkSync(lockPath);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function getPlanningPhase(workspaceDir) {
  const lockPath = path.resolve(workspaceDir, LOCK_FILE);
  try {
    const content = fs.readFileSync(lockPath, 'utf8').trim();
    return content || 'planning';
  } catch {
    return 'planning';
  }
}

function isInsideIssuesDir(filePath, workspaceDir) {
  const issuesRoot = path.resolve(workspaceDir, ISSUES_DIR);
  const resolved = path.resolve(workspaceDir, filePath);
  return resolved.startsWith(issuesRoot + path.sep) || resolved === issuesRoot;
}

function incrementBlockCount(workspaceDir) {
  const countFile = path.resolve(workspaceDir, '.agents', '.planning-block-count');
  let count = 0;
  try { count = parseInt(fs.readFileSync(countFile, 'utf8').trim(), 10) || 0; } catch {}
  count += 1;
  try { fs.writeFileSync(countFile, String(count)); } catch {}
  return count;
}

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';

    if (toolName !== 'Task' && toolName !== 'Write' && toolName !== 'Edit' && toolName !== 'Bash') {
      process.exit(0);
    }

    const workspaceDir = data.cwd || process.cwd();

    if (!isPlanningActive(workspaceDir)) {
      process.exit(0);
    }

    const toolInput = data.tool_input || {};
    const phase = getPlanningPhase(workspaceDir);

    // --- Task: block non-Explore agents ---
    if (toolName === 'Task') {
      const agentType = toolInput.subagent_type || toolInput.agent_type || '';
      const agentTypeLower = agentType.toLowerCase();
      if (agentType && agentTypeLower !== 'explore') {
        const blockCount = incrementBlockCount(workspaceDir);
        const escalation = blockCount >= 3
          ? ` CRITICAL: Block #${blockCount}. You have attempted to spawn non-Explore agents ${blockCount} times during a planning phase.`
          : '';
        process.stderr.write(
          `BLOCKED: Only Explore agents are allowed during planning phases. ` +
          `Attempted: subagent_type="${agentType}". ` +
          `You are in ${phase} — implementation belongs to Phase 3 (/implement-issue). ` +
          `Use Explore agents for codebase research.${escalation}`
        );
        process.exit(2);
      }
    }

    // --- Bash: block file-writing shell commands ---
    if (toolName === 'Bash') {
      const command = toolInput.command || '';
      // Allow safe mkdir targeting .agents/issues/
      const shellOperators = /&&|;|\||>|<|\$\(|`/;
      const safeMkdir = /^\s*mkdir\s+-p\s+(?:['"]?)(\.agents\/issues(?:\/[^\s'"]*)?)(?:['"]?)\s*$/;
      const mkdirMatch = safeMkdir.exec(command);
      if (mkdirMatch && !shellOperators.test(command)) {
        const targetPath = mkdirMatch[1];
        const sandboxRoot = path.resolve(workspaceDir, '.agents', 'issues');
        const resolved = path.resolve(workspaceDir, targetPath);
        if (resolved.startsWith(sandboxRoot + path.sep) || resolved === sandboxRoot) {
          process.exit(0);
        }
      }
      const writePatterns = /\b(cat\s*>|cat\s*<<|echo\s[^|]*>|tee\s|printf\s[^|]*>|cp\s|mv\s|sed\s+-i|awk\s.*>|touch\s|install\s)/;
      if (writePatterns.test(command)) {
        const blockCount = incrementBlockCount(workspaceDir);
        process.stderr.write(
          `BLOCKED: File-writing Bash commands are not allowed during planning phases. ` +
          `You are in ${phase}. ` +
          `Use the Write tool to save planning files inside .agents/issues/. ` +
          `Source file creation happens in Phase 3 (/implement-issue).`
        );
        process.exit(2);
      }
    }

    // --- Write/Edit: must stay inside .agents/issues/ ---
    if (toolName === 'Write' || toolName === 'Edit') {
      const filePath = toolInput.file_path || toolInput.path || '';
      if (!filePath) {
        process.exit(0);
      }

      if (!isInsideIssuesDir(filePath, workspaceDir)) {
        const blockCount = incrementBlockCount(workspaceDir);
        const escalation = blockCount >= 3
          ? ` CRITICAL: Block #${blockCount}. You keep attempting to write source files during planning. Complete your planning artifacts in .agents/issues/ first.`
          : '';
        process.stderr.write(
          `BLOCKED: Writing to "${filePath}" is not allowed during planning phases. ` +
          `You are in ${phase}. ` +
          `Planning artifacts must be saved inside .agents/issues/{issue-folder}/. ` +
          `Source file creation happens in Phase 3 (/implement-issue).${escalation}`
        );
        process.exit(2);
      }
    }

    process.exit(0);
  } catch (e) {
    // On parse error, allow the tool call (fail open)
    process.exit(0);
  }
});
