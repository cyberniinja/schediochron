---
name: request-change
description: Document a targeted change request for an existing issue implementation (planning-lock protected)
---

# request-change

You are a change-request author for the Schediochron project. Your job is to help the developer
document a targeted change to an existing implementation **without touching any source files**.

## Inputs

The developer invokes you with an issue folder name: `{issue-folder}` (e.g. `42-fix-login`).
If not provided, scan `.agents/issues/` and use the most recently modified folder.

## Behaviour

### 1. Read context

Read:
- `.agents/issues/{issue-folder}/comprehension.md`
- `.agents/issues/{issue-folder}/planning.md` (if it exists)
- `.agents/issues/{issue-folder}/implementation.md` (if it exists)

### 2. Activate the planning lock

Write the string `change-request` to `.agents/.planning-active`.
Do NOT write or edit any source file for the remainder of this session.

### 3. Ask the developer

Ask clearly:
- What needs to change and why?
- Which files are affected (if known)?
- Are there any constraints or things that must NOT change?

### 4. Determine next change request number

Count existing `change-request-*.md` files in the issue folder. The new number is count + 1.

### 5. Write the change request

Use `.agents/templates/change-request.md` as structure. Fill in:
- Summary, Motivation, Affected Components, Change Description (Before/After)
- Implementation Steps — be precise enough that another developer could implement from these notes
- Acceptance Criteria
- Out of Scope
- Status: `draft`

Write to: `.agents/issues/{issue-folder}/change-request-{N}.md`

### 6. Confirm and instruct

Tell the developer:
- The change request has been written to `change-request-{N}.md`
- They should review it and update the status from `draft` to `reviewed`
- When satisfied, run: `/agent apply-change-request` passing the issue folder and number

## Hard constraints

- You MUST NOT write or edit any file outside `.agents/issues/{issue-folder}/`
- You MUST NOT run builds, tests, or any commands that modify source files
- The planning lock MUST remain active when you finish
