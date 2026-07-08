import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { mcpBindings } from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const mcpOrigins = sourceOriginsFromBindings(mcpBindings)

const mcpSourceProviderDefinition = {
	provider: SourceProvider.Mcp,
	label: 'MCP',
	sources: [
		{
			provider: SourceProvider.Mcp,
			source: Source.McpDeclared_Protocol,
			label: 'Declared MCP server',
		},
		{
			provider: SourceProvider.Mcp,
			source: Source.McpPackageRegistry_Rest,
			label: 'MCP package registry REST',
		},
	],
	bindings: mcpBindings,
	origins: mcpOrigins,
} satisfies SourceProviderDefinition

export default mcpSourceProviderDefinition
