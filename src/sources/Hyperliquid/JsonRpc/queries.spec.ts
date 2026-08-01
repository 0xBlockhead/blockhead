import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

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

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid EVM binding is missing')

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

	it('uses the exact canonical HyperEVM binding axes', () => {
		expect(binding).toMatchObject({
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rpc.hyperliquid.xyz/evm',
				corsEnabled: true,
			}],
			wireProtocol: WireProtocol.JsonRpc2,
			apiFamily: ApiFamily.EvmExecutionJsonRpc,
			operationGroups: [SourceOperationGroup.EvmRpcCore],
			delivery: SourceDelivery.BrowserDirect,
			credentials: [],
			artifacts: [{
				kind: SourceArtifactKind.OpenRpcSpec,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
			}, {
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			}],
		})
	})

	it.each([
		{
			query: () => getBlockNumber(),
			method: 'eth_blockNumber',
			params: [],
		},
		{
			query: () => getBlockByNumber({
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
				txHash: `0x${'1'.repeat(64)}`,
			}),
			method: 'eth_getTransactionByHash',
			params: [`0x${'1'.repeat(64)}`],
		},
		{
			query: () => getTransactionReceipt({
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
