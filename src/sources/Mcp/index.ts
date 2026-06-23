import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mcpBindings } from '$/sources/Mcp/bindings.ts'

export default {
	provider: SourceProvider.Mcp,
	label: 'MCP',
	sources: [
		{
			provider: SourceProvider.Mcp,
			source: Source.McpConfigured_Protocol,
			label: 'Configured MCP server',
		},
		{
			provider: SourceProvider.Mcp,
			source: Source.McpPackageRegistry_Rest,
			label: 'MCP package registry REST',
		},
	],
	bindings: mcpBindings,
} satisfies SourceProviderDefinition
