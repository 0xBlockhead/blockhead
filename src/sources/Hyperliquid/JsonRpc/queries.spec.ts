import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'

const corsFetch = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch,
	throwHttpError: vi.fn(),
}))

const {
	getBlockByNumber,
	getBlockNumber,
	getTransactionByHash,
	getTransactionReceipt,
} = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Hyperliquid_JsonRpc
		&& candidate.target.kind === SourceTargetKind.Eip155Chain
		&& candidate.target.key === '999'
	))

if (binding == null)
	throw new Error('Hyperliquid_JsonRpc test: canonical source binding is missing')

describe('Hyperliquid JSON-RPC transport', () => {
	beforeEach(() => {
		corsFetch.mockReset()
		corsFetch.mockResolvedValue({
			ok: true,
			json: async () => ({
				jsonrpc: '2.0',
				id: 1,
				result: '0x1',
			}),
		})
	})

	it.each([
		{
			query: () => getBlockNumber({ binding }),
			method: 'eth_blockNumber',
			params: [],
		},
		{
			query: () => getBlockByNumber({
				binding,
				height: 42n,
				includeTransactions: true,
			}),
			method: 'eth_getBlockByNumber',
			params: [
				'0x2a',
				true,
			],
		},
		{
			query: () => getTransactionByHash({
				binding,
				txHash: `0x${'1'.repeat(64)}`,
			}),
			method: 'eth_getTransactionByHash',
			params: [`0x${'1'.repeat(64)}`],
		},
		{
			query: () => getTransactionReceipt({
				binding,
				txHash: `0x${'2'.repeat(64)}`,
			}),
			method: 'eth_getTransactionReceipt',
			params: [`0x${'2'.repeat(64)}`],
		},
	])('uses the canonical binding for $method', async ({
		query,
		method,
		params,
	}) => {
		await query()

		expect(corsFetch).toHaveBeenCalledWith(
			'https://rpc.hyperliquid.xyz/evm',
			expect.objectContaining({
				init: expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({
						jsonrpc: '2.0',
						id: 1,
						method,
						params,
					}),
				}),
			})
		)
	})
})
