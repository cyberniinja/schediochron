#!/usr/bin/env bash
# Auto-launched by VS Code on Codespace attach.
# If an ISSUE env var was set at codespace creation time (via issue-space),
# starts copilot with work-issue. Otherwise starts copilot normally.

if [ -n "$ISSUE" ]; then
  echo "🚀 Starting agent for issue #$ISSUE..."
  copilot --allow-all -i "work-issue #$ISSUE"
else
  copilot --allow-all
fi
