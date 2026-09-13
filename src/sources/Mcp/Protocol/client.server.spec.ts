import { expect, it } from 'vitest'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'

import { connectMcpClient } from './client.server.ts'


it('negotiates a real MCP session, follows catalog pagination and preserves tool failures', async () => {
	const server = new Server({ name: 'test-provider', version: '1' }, {
		capabilities: { tools: {} },
	})
	const calls: string[] = []
	server.setRequestHandler(ListToolsRequestSchema, async (request) => ({
		tools: [{
			name: request.params?.cursor === 'second' ? 'fail' : 'read',
			inputSchema: { type: 'object' },
		}],
		...(request.params?.cursor === undefined && { nextCursor: 'second' }),
	}))
	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		calls.push(request.params.name)
		return {
			content: [{ type: 'text', text: request.params.name }],
			isError: request.params.name === 'fail',
		}
	})
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
	await server.connect(serverTransport)
	const client = await connectMcpClient(clientTransport)
	try {
		expect(client.server?.name).toBe('test-provider')
		expect((await client.listTools()).map((tool) => tool.name)).toEqual(['read', 'fail'])
		const success = await client.callTool({ name: 'read', arguments: {} })
		expect(success.result).toMatchObject({ isError: false, content: [{ text: 'read' }] })
		expect(success.completedAt).toBeGreaterThanOrEqual(success.startedAt)
		expect((await client.callTool({ name: 'fail' })).result.isError).toBe(true)
		expect(calls).toEqual(['read', 'fail'])
	} finally {
		await client.close()
		await server.close()
	}
})

it('rejects cyclic catalog pagination instead of returning partial discovery', async () => {
	const server = new Server({ name: 'cyclic', version: '1' }, {
		capabilities: { tools: {} },
	})
	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [], nextCursor: 'same' }))
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
	await server.connect(serverTransport)
	const client = await connectMcpClient(clientTransport)
	try {
		await expect(client.listTools()).rejects.toThrow('repeated a tool-list cursor')
	} finally {
		await client.close()
		await server.close()
	}
})
