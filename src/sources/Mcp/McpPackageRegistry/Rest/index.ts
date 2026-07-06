// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mcpPackageRegistryRestSourceDefinition = {
	provider: SourceProvider.Mcp,
	source: Source.McpPackageRegistry_Rest,
	label: 'MCP package registry REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mcpPackageRegistryRestSourceDefinition
