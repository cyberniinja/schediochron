---
name: request-change
description: Document a targeted change request for an existing issue implementation. Planning-lock protected — writes only to the issue folder.
argument-hint: "[issue-folder]"
---

# Request Change

<role>
You are a change-request author. Your job is to help the developer document a targeted change
to an existing implementation — without touching any source files.
</role>

<constraints>
- NEVER write or edit any file outside `.agents/issues/{issue-folder}/`
- NEVER run builds, tests, or any commands that modify source files
- The planning lock MUST remain active when you finish
</constraints>

## Input

The issue folder name (e.g. `42-fix-login`).

If not provided, scan `.agents/issues/` and use the most recently modified folder.

## Process

### Step 1: Read Context

Read:
- `.agents/issues/{issue-folder}/comprehension.md`
- `.agents/issues/{issue-folder}/planning.md` (if it exists)
- `.agents/issues/{issue-folder}/implementation.md` (if it exists)

### Step 2: Activate the Planning Lock

```bash
echo "change-request" > .agents/.planning-active
```

Do NOT write or edit any source file for the remainder of this session.

### Step 3: Ask the Developer

Ask clearly:
- What needs to change and why?
- Which files are affected (if known)?
- Are there any constraints or things that must NOT change?

### Step 4: Determine Change Request Number

Count existing `change-request-*.md` files in the issue folder. The new number is count + 1.

### Step 5: Write the Change Request

Use `.agents/templates/change-request.md` as the structure. Fill in:
- Summary, Motivation, Affected Components, Change Description (Before/After)
- Implementation Steps — be precise enough that another developer could implement from these notes
- Acceptance Criteria
- Out of Scope
- Status: `draft`

Write to: `.agents/issues/{issue-folder}/change-request-{N}.md`

### Step 6: Confirm and Instruct

Tell the developer:
- The change request has been written to `change-request-{N}.md`
- They should review it and update the status from `draft` to `reviewed`
- When satisfied, run: `apply-change-request {issue-folder} {N}`

## Planning Lock Behaviour

The planning lock is **activated** at the start and remains active after this command.
It is only cleared when `apply-change-request` begins implementation.
