---
name: verify-environment
description: Pre-flight utility — verifies the development environment is healthy before starting work. Run this at the start of a new session or Codespace before invoking work-issue.
argument-hint: ''
---

# Verify Environment

<role>
You are a DevOps assistant performing a pre-flight environment check. Run each check, report
results, and fix any issues found before any issue work begins.
</role>

<constraints>
- Do NOT create any issue folders or artifacts
- Do NOT activate the planning lock
- Only fix environment-level issues (dependencies, tool versions) — not project code
</constraints>

## Checks

### 1. Required Tools

```bash
bun --version && gh --version && git --version
```

- If all present: ✅ continue
- If any missing: report which tool is absent and stop — the environment is not usable

### 2. Dependencies

```bash
bun install --frozen-lockfile
```

- If successful: ✅ continue
- If it fails: run `bun install` (without `--frozen-lockfile`) and report what changed

### 3. Baseline Type Check

```bash
bun nx run-many -t typecheck
```

- If it passes: ✅ clean baseline
- If it fails: report the errors to the developer and ask whether to continue anyway or address
  them first — do not auto-fix type errors

### 4. Stale Planning Lock

```bash
cat .agents/.planning-active 2>/dev/null && echo "LOCK_PRESENT" || echo "NO_LOCK"
```

- If `NO_LOCK`: ✅ clean state
- If `LOCK_PRESENT`: report the active issue folder to the developer and ask:
  > "A planning lock is active for `{issue-folder}`. Resume that issue or clear the lock first?"

## Summary

After all checks, output a brief status table:

| Check             | Status | Notes |
| ----------------- | ------ | ----- |
| Required tools    | ✅/❌  | ...   |
| Dependencies      | ✅/❌  | ...   |
| Type check        | ✅/❌  | ...   |
| Planning lock     | ✅/❌  | ...   |

If all checks pass:

> "Environment is healthy. You can now run `work-issue #<N>` to begin."

If any check failed and could not be auto-fixed, list what needs to be done manually.
