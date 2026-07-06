// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mcpDeclaredProtocolSourceDefinition = {
	provider: SourceProvider.Mcp,
	source: Source.McpDeclared_Protocol,
	label: 'Declared MCP server',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mcpDeclaredProtocolSourceDefinition
