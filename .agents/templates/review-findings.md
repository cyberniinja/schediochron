# Code Review Findings

**Issue / PR**: #{reference}
**Date**: {YYYY-MM-DD}
**Reviewer**: {reviewerName | AI review}
**Scope**: {staged changes | branch diff | PR #{number}}

---

## Annotation Guide

Annotate each finding with ONE of:

| Annotation               | Meaning                                  |
| ------------------------ | ---------------------------------------- |
| `[FIX]`                  | Apply this fix automatically             |
| `[SKIP]`                 | Ignore — not applicable or intentional   |
| `[MANUAL: instructions]` | Apply with the given custom instructions |

Then run `/address-review-findings` (Claude Code) or `/agent address-review-findings` (Copilot CLI)
to execute all `[FIX]` and `[MANUAL]` items in one pass.

---

## Findings

### Finding 1 — {title}

**Severity**: critical | major | minor | info
**File**: `path/to/file.ts:{line}`
**Annotation**: <!-- Add [FIX], [SKIP], or [MANUAL: ...] here -->

**Description**:

<!-- What is the problem? -->

**Suggested Fix**:

<!-- How should it be fixed? -->

---

### Finding 2 — {title}

**Severity**: critical | major | minor | info
**File**: `path/to/file.ts:{line}`
**Annotation**: <!-- Add [FIX], [SKIP], or [MANUAL: ...] here -->

**Description**:

**Suggested Fix**:

---

<!-- Add additional findings following the same pattern -->

## Summary

| Severity | Count | Annotated |
| -------- | ----- | --------- |
| Critical | 0     | —         |
| Major    | 0     | —         |
| Minor    | 0     | —         |
| Info     | 0     | —         |
