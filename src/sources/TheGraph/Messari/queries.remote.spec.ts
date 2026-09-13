import { readFile } from 'node:fs/promises'
import { beforeEach, expect, it, vi } from 'vitest'

const { connect, callTool, close } = vi.hoisted(() => ({
	connect: vi.fn(),
	callTool: vi.fn(),
	close: vi.fn(),
}))
vi.mock('$app/server', () => ({
	query: <_Input, _Result>(schema: { assert: (input: object) => _Input }, handler: (input: _Input) => _Result) => Object.assign(
		(input: object) => handler(schema.assert(input)),
		{ __: { type: 'query' } }
	),
}))
vi.mock('../Mcp/client.server.ts', () => ({ connectSubgraphMcp: connect }))

import { getProtocolFinancials } from './queries.remote.ts'

beforeEach(() => {
	vi.resetAllMocks()
	connect.mockResolvedValue({ callTool, close })
})

it.each(['uniswap', 'sushiswap'])('consumes the captured %s provider response and preserves deployment identity', async (protocol) => {
	const evidence = JSON.parse(await readFile(new URL(`../../../../research/messari-standardized-subgraphs/live-${protocol}-arbitrum-introspection.json.query.json`, import.meta.url), 'utf8'))
	callTool.mockResolvedValue(evidence.response)
	const result = await getProtocolFinancials({ subgraphId: evidence.subgraphId })
	expect(result.subgraphId).toBe(evidence.subgraphId)
	expect(result.data.dexAmmProtocols[0]?.schemaVersion).toBe(protocol === 'sushiswap' ? '4.0.0' : '4.0.1')
	expect(callTool).toHaveBeenCalledWith(expect.objectContaining({
		name: 'execute_query_by_subgraph_id',
		arguments: expect.objectContaining({ subgraph_id: evidence.subgraphId }),
	}))
	expect(close).toHaveBeenCalledOnce()
})

it('closes after a transport failure', async () => {
	callTool.mockRejectedValue(new Error('connection lost'))
	await expect(getProtocolFinancials({ subgraphId: 'test' })).rejects.toThrow('connection lost')
	expect(close).toHaveBeenCalledOnce()
})

it('rejects a tool error instead of parsing its content as data', async () => {
	callTool.mockResolvedValue({ result: { isError: true, content: [] } })
	await expect(getProtocolFinancials({ subgraphId: 'test' })).rejects.toThrow('tool failed')
	expect(close).toHaveBeenCalledOnce()
})
