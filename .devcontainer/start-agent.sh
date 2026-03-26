#!/usr/bin/env bash
# Auto-launched by VS Code on Codespace attach.
# Reads the issue number from CODESPACE_DISPLAY_NAME if it matches the
# issue-space convention "#<number>". Falls back to plain copilot otherwise.

DISPLAY="$CODESPACE_DISPLAY_NAME"

if [[ "$DISPLAY" =~ ^#([0-9]+)$ ]]; then
  ISSUE="${BASH_REMATCH[1]}"
  echo "🚀 Starting agent for issue #$ISSUE..."
  copilot --allow-all -i "work-issue #$ISSUE"
else
  copilot --allow-all
fi
