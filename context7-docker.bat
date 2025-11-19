@echo off
REM Context7 MCP Server через Docker
cd /d "%~dp0"
docker run --rm -i -v "%CD%:/workspace" -w /workspace node:20-alpine sh -c "NPM_CONFIG_UPDATE_NOTIFIER=false npx -y @upstash/context7-mcp 2>/dev/null || npx -y @upstash/context7-mcp"
