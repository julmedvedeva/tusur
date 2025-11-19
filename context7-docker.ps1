# Context7 MCP Server через Docker
$workspacePath = $PSScriptRoot

# Запускаем Docker контейнер с context7
docker run --rm -i `
  -v "${workspacePath}:/workspace" `
  -w /workspace `
  node:20-alpine `
  sh -c "npx -y @context7/mcp-server"
