import { beforeEach, expect, it, vi } from 'vitest'
import type { Tool } from '@modelcontextprotocol/sdk/types.js'

const { discover } = vi.hoisted(() => ({
	discover: vi.fn<() => Promise<{ tools: Tool[] }>>(),
}))
vi.mock('$/sources/TheGraph/Mcp/queries.remote.ts', () => ({ discover }))

import resolverModule from './TheGraph-Mcp.ts'


const serverKey = 'TheGraph_Mcp:subgraph-mcp'
const server = resolverModule.resolvers.find((resolver) => resolver.entityType === 'McpServer')
const tool = resolverModule.resolvers.find((resolver) => resolver.entityType === 'McpTool')
if (!server || !tool)
	throw new Error('Graph MCP resolver declarations missing')

beforeEach(() => {
	discover.mockReset()
	discover.mockResolvedValue({ tools: [{ name: 'search', inputSchema: { type: 'object' } }] })
})

it('scopes both selectors to the configured server without contacting other servers', async () => {
	expect(server.resolve.ServerKey.appliesTo).toEqual([{ serverKey }])
	expect(tool.resolve.ServerName.appliesTo).toEqual([{ $server: { serverKey } }])
	await expect(server.resolve.ServerKey.resolve({ serverKey: 'other' })).rejects.toThrow('unsupported server')
	await expect(tool.resolve.ServerName.resolve({ $server: { serverKey: 'other' }, name: 'search' })).rejects.toThrow('unsupported server')
	expect(discover).not.toHaveBeenCalled()
})

it('maps catalog identity and tool schemas without inventing unsupported capabilities', async () => {
	const snapshot = await server.resolve.ServerKey.resolve({ serverKey })
	expect(snapshot.tools).toHaveLength(1)
	expect(server.projections.$$tools(snapshot)).toEqual([
		{ __selector: { $server: { serverKey }, name: 'search' } },
	])
	expect(server.projections).not.toHaveProperty('$$prompts')
	const result = await tool.resolve.ServerName.resolve({ $server: { serverKey }, name: 'search' })
	expect(result).toEqual({ $server: { serverKey }, name: 'search', inputSchema: { type: 'object' } })
	expect(tool.projections.$server(result)).toEqual({ __selector: { serverKey } })
})

it('distinguishes an empty catalog, a missing tool and provider failure', async () => {
	discover.mockResolvedValue({ tools: [] })
	expect((await server.resolve.ServerKey.resolve({ serverKey })).tools).toEqual([])
	await expect(tool.resolve.ServerName.resolve({ $server: { serverKey }, name: 'missing' })).rejects.toThrow('not declared')
	discover.mockRejectedValue(new Error('provider unavailable'))
	await expect(server.resolve.ServerKey.resolve({ serverKey })).rejects.toThrow('provider unavailable')
})
