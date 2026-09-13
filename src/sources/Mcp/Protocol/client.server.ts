import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import type { CallToolRequest, Tool } from '@modelcontextprotocol/sdk/types.js'


export const connectMcpClient = async (transport: Transport) => {
	const client = new Client({
		name: 'blockhead',
		version: '0.0.1',
	})
	try {
		await client.connect(transport, { timeout: 30_000 })
	} catch (error) {
		await client.close().catch(() => undefined)
		throw error
	}

	return {
		server: client.getServerVersion(),
		capabilities: client.getServerCapabilities(),
		async listTools() {
			const tools: Tool[] = []
			const cursors = new Set<string>()
			let cursor: string | undefined
			do {
				const page = await client.listTools({ cursor })
				tools.push(...page.tools)
				cursor = page.nextCursor
				if (cursor !== undefined) {
					if (cursors.has(cursor))
						throw new Error('MCP server repeated a tool-list cursor')

					cursors.add(cursor)
				}
			} while (cursor !== undefined)
			return tools
		},
		async callTool(params: CallToolRequest['params']) {
			const startedAt = Date.now()
			const result = await client.callTool(params, undefined, { timeout: 60_000 })
			return {
				startedAt,
				completedAt: Date.now(),
				result,
			}
		},
		close: () => client.close(),
	}
}

export const connectRemoteMcpClient = ({
	url,
	transportKind,
	headers,
}: {
	url: URL
	transportKind: 'sse' | 'streamable-http'
	headers?: HeadersInit
}) => connectMcpClient(
	transportKind === 'sse' ?
		new SSEClientTransport(url, {
			requestInit: { headers },
			eventSourceInit: {
				fetch: (input, init) => {
					const requestHeaders = new Headers(init?.headers)
					new Headers(headers).forEach((value, name) => requestHeaders.set(name, value))
					return fetch(input, { ...init, headers: requestHeaders })
				},
			},
		})
	:
		new StreamableHTTPClientTransport(url, {
			requestInit: { headers },
		})
)
