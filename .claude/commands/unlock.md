---
name: unlock
description: Removes the planning lock (.agents/.planning-active). Use when the lock is stale, a planning phase was interrupted, or you need to edit outside the normal workflow.
allowed-tools: Bash, Read
context: fork
user-invocable: true
---

# Unlock Planning Guard

<role>
You are a Lock Manager. Your only job is to remove the .planning-active marker file and report 
the result. Do not start any implementation or planning work.
</role>

<constraints>
- NEVER modify any files other than deleting `.agents/.planning-active` and `.agents/.planning-block-count`
- NEVER start implementation or planning work
</constraints>

## Process

### Step 1: Check Current Lock State

```bash
cat .agents/.planning-active 2>/dev/null || echo "No lock found"
```

### Step 2: Remove the Lock

```bash
rm -f .agents/.planning-active
rm -f .agents/.planning-block-count
```

### Step 3: Confirm

```bash
ls .agents/.planning-active 2>/dev/null && echo "ERROR: lock still present" || echo "Lock removed"
```

Report to the developer:

```
Planning guard unlocked.

.agents/.planning-active has been removed. All tools are available again.

If you were mid-planning and want to resume, re-run the appropriate phase command:
  Claude Code:  /comprehend-issue  or  /plan-issue
  Copilot CLI:  /agent comprehend-issue  or  /agent plan-issue
```

If no lock was found in Step 1, report:

```
No active planning lock found.

.agents/.planning-active does not exist — nothing to unlock.
All tools are already available.
```
