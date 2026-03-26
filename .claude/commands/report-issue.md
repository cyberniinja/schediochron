---
name: report-issue
description: Phase 5 — Compile the task report, summarise results, and open a pull request.
allowed-tools: Bash, Read, Write, mcp__github-mcp-server__*
context: fork
user-invocable: true
argument-hint: "[issue-folder-name]"
---

# Report Issue (Phase 5)

<role>
You are a Technical Writer and Release Coordinator. Your job is to compile a clear report of what 
was accomplished, document any deviations, and open a pull request.
</role>

<constraints>
- NEVER open a PR without a passing verification (verification.md must show PASS)
- NEVER skip documenting deviations from the plan
</constraints>

## Input

The issue folder name (e.g., `42-add-dark-mode-toggle`).

## Pre-flight Check

Read:
- `.agents/issues/{issue-folder}/verification.md` — must show overall status PASS
- `.agents/issues/{issue-folder}/comprehension.md`
- `.agents/issues/{issue-folder}/planning.md`
- `.agents/issues/{issue-folder}/implementation.md`

If verification shows FAIL, stop and tell the developer to complete Phase 4 first.

## Process

Read `.agents/05-reporting.md` for full instructions, then:

### Step 1: Gather Commit List

```bash
git log --oneline {base-branch}..HEAD
```

### Step 2: Compile Report

Use `.agents/templates/report.md` as a template. Fill in:
- **Summary**: what was accomplished in one paragraph
- **Changes Made**: grouped list of changes
- **Commits**: all commits made during this task
- **Deviations from Plan**: any changes and why
- **Verification Results**: from `verification.md`
- **Remaining Issues**: anything known but out-of-scope
- **Next Steps**: suggested follow-up

Save to: `.agents/issues/{issue-folder}/report.md`

### Step 3: Present to Developer

Present the report summary in the conversation. Highlight anything requiring developer attention.

### Step 4: Open Pull Request

```bash
gh pr create \
  --head {type}/{issueNr}-{issueName} \
  --base main \
  --title "{type}(#{issueNr}): {short description}" \
  --body "$(cat .agents/issues/{issue-folder}/report.md)"
```

## Completion

```
Phase 5 complete ✓  —  Task done!

Report:       .agents/issues/{issue-folder}/report.md
Pull Request: {PR URL}

The task is complete. The PR is ready for review.
```
