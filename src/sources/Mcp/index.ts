// Generated from APP.ts.

import bindings from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Mcp,
	label: 'MCP',
	sources: [
		{
			source: Source.McpDeclared_Protocol,
			label: 'Declared MCP server',
		},
		{
			source: Source.McpPackageRegistry_Rest,
			label: 'MCP package registry REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>
