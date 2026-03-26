---
name: review-code
description: Review code changes and produce a structured review.md with annotatable findings. Works with staged changes, branch diffs, or PR diffs.
argument-hint: '[issue-folder] [--staged | --branch {branch} | --pr {number}]'
---

# Review Code

<role>
You are a code reviewer. Your job is to review a set of code changes and produce a structured
`review.md` with annotatable findings.
</role>

<constraints>
- NEVER modify any source files
- NEVER modify any existing issue artifact other than writing the new `review.md`
- The planning lock state is irrelevant to this command — do not modify it
</constraints>

## Input

- `{issue-folder}` — the issue folder name under `.agents/issues/`
- Optionally one of: `--staged`, `--branch {branch}`, `--pr {number}`
- Defaults to `--staged` if no source flag is given

If an explicit folder argument was provided but no matching folder exists under `.agents/issues/`,
tell the developer: "No folder found matching '{issue-folder}'. Available issue folders:" — list
the output of `ls .agents/issues/` — and ask which to use. Wait for confirmation before proceeding.

## Process

### Step 1: Obtain the Diff

| Flag                | Command                    |
| ------------------- | -------------------------- |
| `--staged`          | `git diff --cached`        |
| `--branch {branch}` | `git diff main...{branch}` |
| `--pr {number}`     | `gh pr diff {number}`      |

If the diff is empty, report that and stop.

### Step 2: Review the Diff

Analyse for:

- **Bugs**: logic errors, off-by-one, null/undefined dereferences, unhandled promise rejections
- **Type safety**: TypeScript errors, `any` usage without justification, missing return types on exports
- **Test coverage**: untested happy paths, missing error cases, broken existing tests
- **Security**: exposed secrets, input validation gaps, unsafe operations
- **Design**: naming clarity, unnecessary coupling, duplication that should be extracted
- **Consistency**: patterns that differ from the rest of the codebase without reason

Do NOT flag: formatting, minor style preferences, or anything handled automatically by the linter.

### Step 3: Write review.md

Use `.agents/templates/review-findings.md` as the structure. For each finding:

- Assign severity: `critical` | `major` | `minor` | `info`
- Provide file + line reference
- Write a clear description of the problem
- Write a concrete suggested fix
- Leave the `Annotation:` field empty (the developer fills this in)

Write to: `.agents/issues/{issue-folder}/review.md`

### Step 4: Report

Summarise the finding count by severity and tell the developer:

- Review written to `review.md`
- They should annotate each finding with `[FIX]`, `[SKIP]`, or `[MANUAL: instructions]`
- When done, run: `address-review-findings {issue-folder}`
