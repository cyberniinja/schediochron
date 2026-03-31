#!/usr/bin/env bash
set -euo pipefail

# --- Bun ---
curl -fsSL https://bun.sh/install | bash
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc

# --- Copilot CLI ---
if command -v copilot &>/dev/null; then
  echo "✅ copilot CLI already installed"
else
  echo "Installing copilot CLI..."
  curl -fsSL https://gh.io/copilot-install | bash
fi

# --- Copilot config (skip first-run prompts) ---
COPILOT_CONFIG_DIR="$HOME/.copilot"
COPILOT_CONFIG="$COPILOT_CONFIG_DIR/config.json"
mkdir -p "$COPILOT_CONFIG_DIR"
if [ ! -f "$COPILOT_CONFIG" ]; then
  cat > "$COPILOT_CONFIG" << 'EOF'
{
  "banner": "never",
  "trusted_folders": ["/workspaces"],
  "firstLaunchAt": "2026-01-01T00:00:00.000Z"
}
EOF
  echo "✅ copilot config pre-seeded"
fi
