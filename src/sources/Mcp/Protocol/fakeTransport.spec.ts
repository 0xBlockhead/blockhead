import { expect, it } from 'vitest'

import { discoverMcpServer } from './queries.ts'
import type { McpJsonRpcRequest, McpJsonRpcResponse, McpJsonRpcTransport } from './types.ts'
import bindings from '$/sources/Mcp/bindings.ts'
import { Source } from '$/sources/Source.ts'

const fakeMcpTransport = (): McpJsonRpcTransport => ({
	request: async (request: McpJsonRpcRequest): Promise<McpJsonRpcResponse> => ({
		jsonrpc: '2.0',
		id: request.id,
		...(request.method === 'initialize' && { result: { protocolVersion: '2025-06-18', capabilities: { tools: {}, prompts: {}, resources: { subscribe: true } }, serverInfo: { name: 'Blockhead fake MCP server', version: '1.0.0' } } }),
		...(request.method === 'tools/list' && { result: { tools: [{ name: 'sum' }] } }),
		...(request.method === 'prompts/list' && { result: { prompts: [{ name: 'welcome' }] } }),
		...(request.method === 'resources/list' && { result: { resources: [{ uri: 'https://fake.blockhead.test/readme' }] } }),
		...(request.method === 'resources/templates/list' && { result: { resourceTemplates: [] } }),
	}),
})

it('materializes the deterministic catalog without a tools/call request', async () => {
	const snapshot = await discoverMcpServer(
		bindings[Source.McpDeclared_Protocol][0],
		'fake-server',
		fakeMcpTransport(),
	)

	expect(snapshot).toMatchObject({
		status: 'connected',
		catalog: {
			tools: [{ name: 'sum' }],
			resources: [{ uri: 'https://fake.blockhead.test/readme' }],
			prompts: [{ name: 'welcome' }],
		},
	})
})

it('fails closed when browser identity is unavailable', async () => {
	const snapshot = await discoverMcpServer(
		bindings[Source.McpDeclared_Protocol][0],
		'missing-identity',
		{ request: async () => { throw new Error('McpDeclared_Protocol: browser identity unavailable') } },
	)

	expect(snapshot).toMatchObject({ status: 'disconnected' })
	expect(snapshot.error).toContain('browser identity unavailable')
})
