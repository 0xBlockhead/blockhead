import { expect, it } from 'vitest'

import bindings from '$/sources/Mcp/bindings.ts'
import { discoverMcpServer } from '$/sources/Mcp/Protocol/queries.ts'
import type { McpJsonRpcRequest, McpJsonRpcResponse, McpJsonRpcTransport } from '$/sources/Mcp/Protocol/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.McpDeclared_Protocol][0]

const fakeServer = (responses: Record<string, McpJsonRpcResponse>) => {
	const requests: McpJsonRpcRequest[] = []
	const transport: McpJsonRpcTransport = {
		request: async (request: McpJsonRpcRequest): Promise<McpJsonRpcResponse> => {
			requests.push(request)
			return responses[request.method] ?? {
				jsonrpc: '2.0',
				id: request.id,
				error: { code: -32601, message: 'method not found' },
			}
		},
		notify: async () => undefined,
	}
	return { ...transport, requests }
}

const responses = {
	initialize: {
		jsonrpc: '2.0',
		id: 1,
		result: {
			protocolVersion: '2025-06-18',
			capabilities: { tools: {}, prompts: {}, resources: { subscribe: true } },
			serverInfo: { name: 'fake-server', version: '1.2.3' },
		},
	},
	'tools/list': { jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'sum', description: 'Adds values', inputSchema: { type: 'object' } }] } },
	'prompts/list': { jsonrpc: '2.0', id: 3, result: { prompts: [{ name: 'welcome', arguments: { type: 'object' } }] } },
	'resources/list': { jsonrpc: '2.0', id: 4, result: { resources: [{ uri: 'https://fake.test/readme', name: 'README', mimeType: 'text/plain' }] } },
	'resources/templates/list': { jsonrpc: '2.0', id: 5, result: { resourceTemplates: [{ uriTemplate: 'https://fake.test/{name}', name: 'named' }] } },
} satisfies Record<string, McpJsonRpcResponse>

it('discovers identity and all declared MCP capabilities without invoking a tool', async () => {
	const server = fakeServer(responses)
	const snapshot = await discoverMcpServer(binding, 'fake-key', server)

	expect(snapshot).toMatchObject({
		status: 'connected',
		serverKey: 'fake-key',
		server: { name: 'fake-server', version: '1.2.3' },
		catalog: {
			tools: [{ name: 'sum' }],
			prompts: [{ name: 'welcome' }],
			resources: [{ uri: 'https://fake.test/readme' }],
			resourceTemplates: [{ uriTemplate: 'https://fake.test/{name}' }],
		},
	})
	expect(server.requests.map(({ method }) => method)).toEqual([
		'initialize',
		'tools/list',
		'prompts/list',
		'resources/list',
		'resources/templates/list',
	])
})

it('keeps disconnected and malformed discovery truthful', async () => {
	const disconnected = await discoverMcpServer(binding, 'offline', {
		request: async () => { throw new Error('socket closed') },
	})
	const malformed = await discoverMcpServer(binding, 'broken', {
		request: async (request) => ({ jsonrpc: '2.0', id: request.id, result: 'not an object' }),
	})

	expect(disconnected).toMatchObject({ status: 'disconnected', serverKey: 'offline' })
	expect(disconnected.error).toContain('socket closed')
	expect(malformed).toMatchObject({ status: 'malformed', serverKey: 'broken' })
})
