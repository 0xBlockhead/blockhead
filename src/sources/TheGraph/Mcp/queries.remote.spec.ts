import { beforeEach, expect, it, vi } from 'vitest'
import type { CallToolRequest, Tool } from '@modelcontextprotocol/sdk/types.js'

const { connect, listTools, callTool, close } = vi.hoisted(() => ({
	connect: vi.fn(),
	listTools: vi.fn<() => Promise<Tool[]>>(),
	callTool: vi.fn<(params: CallToolRequest['params']) => Promise<{ startedAt: number, completedAt: number, result: { isError: boolean } }>>(),
	close: vi.fn<() => Promise<void>>(),
}))
vi.mock('$app/server', () => ({
	query: <_Result>(handler: () => _Result) => Object.assign(handler, { __: { type: 'query' } }),
	command: <_Input, _Result>(schema: { parse: (input: object) => _Input }, handler: (input: _Input) => _Result) => Object.assign(
		(input: object) => handler(schema.parse(input)),
		{ __: { type: 'command' } }
	),
}))
vi.mock('./client.server.ts', () => ({ connectSubgraphMcp: connect }))

import { discover, invoke } from './queries.remote.ts'


beforeEach(() => {
	vi.resetAllMocks()
	close.mockResolvedValue()
	listTools.mockResolvedValue([])
	callTool.mockResolvedValue({ startedAt: 10, completedAt: 20, result: { isError: false } })
	connect.mockResolvedValue({
		server: { name: 'provider', version: '1' },
		capabilities: { tools: {} },
		listTools,
		callTool,
		close,
	})
})

it('returns only provider discovery and closes its session after success', async () => {
	expect(await discover()).toEqual({
		server: { name: 'provider', version: '1' },
		capabilities: { tools: {} },
		tools: [],
	})
	expect(close).toHaveBeenCalledOnce()
})

it('closes after catalog failure without fabricating an empty catalog', async () => {
	listTools.mockRejectedValue(new Error('catalog unavailable'))
	await expect(discover()).rejects.toThrow('catalog unavailable')
	expect(close).toHaveBeenCalledOnce()
})

it('does not attempt discovery when connection authorization fails', async () => {
	connect.mockRejectedValue(new Error('unauthorized'))
	await expect(discover()).rejects.toThrow('unauthorized')
	expect(listTools).not.toHaveBeenCalled()
})

it('forwards authorized native arguments and preserves the provider tool-error result', async () => {
	callTool.mockResolvedValue({ startedAt: 10, completedAt: 20, result: { isError: true } })
	const params = { name: 'search_subgraphs_by_keyword', arguments: { keyword: 'Uniswap' } }
	expect(await invoke(params)).toEqual({ startedAt: 10, completedAt: 20, result: { isError: true } })
	expect(callTool).toHaveBeenCalledExactlyOnceWith(params)
	expect(close).toHaveBeenCalledOnce()
})

it('rejects unreviewed tools before using the gateway credential', async () => {
	await expect(invoke({ name: 'unreviewed_write_tool' })).rejects.toThrow('not authorized')
	expect(connect).not.toHaveBeenCalled()
})

it('closes after invocation transport failure without returning a tool success', async () => {
	callTool.mockRejectedValue(new Error('connection lost'))
	await expect(invoke({ name: 'search_subgraphs_by_keyword', arguments: { keyword: 'Uniswap' } })).rejects.toThrow('connection lost')
	expect(close).toHaveBeenCalledOnce()
})
