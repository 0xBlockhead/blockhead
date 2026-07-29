import { readFileSync } from 'node:fs'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	getEvmTransactionByHash,
	getEvmTransactionReceipt,
} from '$/sources/GetBlock/Rpc/queries.ts'

const sourceFetch = vi.hoisted(() => vi.fn())
const resolverBinding = vi.hoisted(() => ({
	source: 'GetBlockRpc_JsonRpc',
	target: {
		kind: 'Eip155Chain',
		key: '1',
	},
	endpoints: [{
		endpointKind: 'HttpUrl',
		locator: 'https://go.getblock.io/{GETBLOCK_API_KEY}/',
		origin: 'https://go.getblock.io',
		corsEnabled: false,
	}],
	wireProtocol: 'JsonRpc2',
	apiFamily: 'EvmExecutionJsonRpc',
	operationGroups: ['EvmRpcCore'],
	delivery: 'HttpProxy',
	credentials: [{
		scope: 'RuntimeSecret',
	}],
	artifacts: [
		{
			kind: 'OpenRpcSpec',
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/src',
			generated: false,
		},
		{
			kind: 'GenerationManifest',
			path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			generated: false,
		},
	],
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://go.getblock.io/runtime-token/',
	sourceFetch,
}))

const { default: getBlockRpc } = await import('$/resolvers/GetBlock-Rpc.ts')
const transaction = readFileSync(
	new URL('../sources/GetBlock/Rpc/fixtures/transaction.json', import.meta.url),
	'utf8'
)
const receipt = readFileSync(
	new URL('../sources/GetBlock/Rpc/fixtures/transaction-receipt.json', import.meta.url),
	'utf8'
)
const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const queryBinding = {
	source: Source.GetBlockRpc_JsonRpc,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: '1',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://go.getblock.io/runtime-token/',
	}],
	wireProtocol: WireProtocol.JsonRpc2,
	apiFamily: ApiFamily.EvmExecutionJsonRpc,
	operationGroups: [SourceOperationGroup.EvmRpcCore],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{ scope: SourceCredentialScope.None }],
} as const satisfies SourceBinding

describe('GetBlock RPC transaction source', () => {
	beforeEach(() => vi.clearAllMocks())

	it('executes transaction and receipt JSON-RPC methods', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(receipt))
		await expect(getEvmTransactionByHash('0xaaaa')).resolves.toMatchObject({
			hash: expect.any(String),
		})
		await expect(getEvmTransactionReceipt('0xaaaa')).resolves.toMatchObject({
			status: '0x1',
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			method: 'eth_getTransactionByHash',
			params: ['0xaaaa'],
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body)).toMatchObject({
			method: 'eth_getTransactionReceipt',
			params: ['0xaaaa'],
		})
	})

	it('maps the exact transaction and receipt field ownership', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(receipt))
		const resolved = await getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)
		expect(Object.keys(getBlockRpc.resolvers[0].projections).sort()).toEqual([
			'$$logs',
			'$block',
			'$from',
			'$to',
			'cumulativeGasUsed',
			'effectiveGasPrice',
			'executionStatus',
			'gas',
			'gasPrice',
			'gasUsed',
			'indexInBlock',
			'input',
			'nonce',
			'r',
			's',
			'v',
			'value',
		].sort())
		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 16n,
				},
			},
			value: 100n,
			nonce: 3,
			indexInBlock: 2,
			gas: 21_000n,
			gasUsed: 21_000n,
			cumulativeGasUsed: 21_000n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			$$logs: [{
				[EntityMetaKey.Selector]: {
					indexInTransaction: 0,
				},
			}],
		})
	})

	it('preserves a pending transaction when its receipt is not available yet', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 2,
				result: null,
			})))
		await expect(getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)).resolves.toMatchObject({
			executionStatus: EvmTransactionExecutionStatus.Pending,
			$$logs: [],
		})
	})

	it('keeps an empty transaction distinct from transport failure', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: null,
		})))
		await expect(getEvmTransactionByHash('0xmissing')).resolves.toBeNull()
		sourceFetch.mockResolvedValueOnce(new Response('upstream failed', { status: 503 }))
		await expect(getEvmTransactionByHash('0xfailure')).rejects.toThrow()
	})
})
