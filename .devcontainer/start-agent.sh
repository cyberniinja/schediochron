#!/usr/bin/env bash
# Auto-launched by VS Code on Codespace attach.
# issue-space sets the display name to "#<N>", which GitHub turns into
# "<N>-<random>" as the machine name (CODESPACE_NAME). Extract leading digits.

ISSUE=$(echo "$CODESPACE_NAME" | grep -oP '^[0-9]+(?=-)')

if [ -n "$ISSUE" ]; then
  echo "🚀 Starting agent for issue #$ISSUE..."
  copilot --allow-all --add-dir /workspaces -i "work-issue #$ISSUE"
else
  copilot --allow-all --add-dir /workspaces
fi
