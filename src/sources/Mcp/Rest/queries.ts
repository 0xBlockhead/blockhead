import { Source } from '$/sources/Source.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { McpRegistryServers } from '$/sources/Mcp/Rest/types.ts'

export const getRegistryServers = (binding: SourceBinding) => {
	if (binding.source !== Source.McpPackageRegistry_Rest)
		throw new Error('MCP registry server list requires McpPackageRegistry_Rest binding')

	return getJson<McpRegistryServers>(binding)
}
