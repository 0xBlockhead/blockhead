import { env } from '$env/dynamic/private'

import bindings from '$/sources/TheGraph/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { connectRemoteMcpClient } from '$/sources/Mcp/Protocol/client.server.ts'


export const connectSubgraphMcp = async () => {
	const binding = bindings[Source.TheGraph_Mcp][0]
	const apiKey = env[binding.credentials[0].keys[0]]?.trim()
	if (!apiKey)
		throw new Error('The Graph MCP requires a configured gateway API key')

	return connectRemoteMcpClient({
		url: new URL(binding.endpoints[0].locator),
		transportKind: 'sse',
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
	})
}
