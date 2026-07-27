// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

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
	bindings: [
		bindings[Source.McpDeclared_Protocol],
		bindings[Source.McpPackageRegistry_Rest],
	],
} satisfies SourceProviderDefinition
