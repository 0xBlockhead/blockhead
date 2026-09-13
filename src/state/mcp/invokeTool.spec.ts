import { beforeEach, expect, it, vi } from 'vitest'

const { write, invoke } = vi.hoisted(() => ({
	write: vi.fn(),
	invoke: vi.fn(),
}))
vi.mock('$/collections/localMutations.ts', () => ({ writeLocalMcpToolCall: write }))
vi.mock('$/sources/TheGraph/Mcp/queries.remote.ts', () => ({ invoke }))

import { invokeTool } from './invokeTool.ts'


const context = { entityCollections: {}, entityFieldCollections: {}, entityFieldCountCollections: {} }
const tool = { $server: { serverKey: 'TheGraph_Mcp:subgraph-mcp' }, name: 'search_subgraphs_by_keyword' }

beforeEach(() => {
	vi.resetAllMocks()
	invoke.mockResolvedValue({ startedAt: 10, completedAt: 20, result: { content: [], isError: false } })
})

it('persists intent before dispatch and the exact provider result afterward', async () => {
	const result = await invokeTool(context, tool, '{"keyword":"Uniswap"}')
	expect(write).toHaveBeenCalledTimes(2)
	expect(write.mock.invocationCallOrder[0]).toBeLessThan(invoke.mock.invocationCallOrder[0])
	expect(write.mock.invocationCallOrder[1]).toBeGreaterThan(invoke.mock.invocationCallOrder[0])
	expect(write.mock.calls[1][1]).toEqual(result.selector)
	expect(write.mock.calls[1][2]).toMatchObject({ observation: { status: 'completed', isError: false, payload: { content: [], isError: false } } })
	expect(invoke).toHaveBeenCalledExactlyOnceWith({ name: tool.name, arguments: { keyword: 'Uniswap' } })
})

it('does not dispatch when intent persistence fails', async () => {
	write.mockRejectedValueOnce(new Error('disk unavailable'))
	await expect(invokeTool(context, tool, '{}')).rejects.toThrow('disk unavailable')
	expect(invoke).not.toHaveBeenCalled()
})

it('records transport failure separately from a completed tool error', async () => {
	invoke.mockRejectedValueOnce(new Error('connection lost'))
	expect((await invokeTool(context, tool, '{}')).error).toBe('connection lost')
	expect(write.mock.calls[1][2].observation).toMatchObject({ status: 'transport-error', error: 'connection lost' })
	expect(write.mock.calls[1][2].observation).not.toHaveProperty('isError')
	expect(invoke).toHaveBeenCalledOnce()
})

it('never redispatches or relabels an audit failure after the provider responded', async () => {
	write.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('response persistence failed'))
	await expect(invokeTool(context, tool, '{}')).rejects.toThrow('response persistence failed')
	expect(invoke).toHaveBeenCalledOnce()
	expect(write).toHaveBeenCalledTimes(2)
})

it('rejects unsupported authority and invalid arguments before persistence or dispatch', async () => {
	await expect(invokeTool(context, { ...tool, $server: { serverKey: 'other' } }, '{}')).rejects.toThrow('No invocation authority')
	await expect(invokeTool(context, tool, '[]')).rejects.toThrow()
	expect(write).not.toHaveBeenCalled()
	expect(invoke).not.toHaveBeenCalled()
})
