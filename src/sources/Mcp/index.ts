// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mcpConfiguredProtocolSourceDefinition = {
	provider: SourceProvider.Mcp,
	source: Source.McpConfigured_Protocol,
	label: 'Configured MCP server',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mcpConfiguredProtocolSourceDefinition
