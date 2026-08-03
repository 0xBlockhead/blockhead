import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import transaction from '$/sources/Envio/HyperRpc/fixtures/transaction.json'
import transactionReceipt from '$/sources/Envio/HyperRpc/fixtures/transaction-receipt.json'
import {
	getTransactionByHash,
	getTransactionReceipt,
} from '$/sources/Envio/HyperRpc/queries.ts'

const {
	jsonRpc2,
	resolverBinding,
} = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
	resolverBinding: {
		source: 'EnvioHyperRpc_JsonRpc',
		target: {
			kind: 'Eip155Chain',
			key: '1',
		},
		endpoints: [{
			endpointKind: 'HttpUrl',
			locator: 'https://eth.rpc.hypersync.xyz/{ENVIO_API_TOKEN}',
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
			},
			{
				kind: 'GenerationManifest',
				path: 'src/sources/_shared/interfaces/EvmExecutionJsonRpc/OpenRpc/schema-source.ts',
			},
		],
	},
}))

vi.mock('$/sources/Source.ts', async (importOriginal) => {
	const sourceModule = await importOriginal<{ Source: object }>()
	return {
		...sourceModule,
		Source: {
			...sourceModule.Source,
			EnvioHyperRpc_JsonRpc: 'EnvioHyperRpc_JsonRpc',
		},
	}
})

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { default: envioHyperRpc } = await import('$/resolvers/Envio-HyperRpc.ts')

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

describe('Envio HyperRPC query boundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('executes the two approved read-only JSON-RPC methods', async () => {
		jsonRpc2
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(transactionReceipt)

		await expect(getTransactionByHash(transaction.hash)).resolves.toEqual(transaction)
		await expect(getTransactionReceipt(transaction.hash)).resolves.toEqual(transactionReceipt)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({ source: resolverBinding.source }),
			'eth_getTransactionByHash',
			[transaction.hash],
			undefined
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({ source: resolverBinding.source }),
			'eth_getTransactionReceipt',
			[transaction.hash],
			undefined
		)
	})

	it('preserves complete-empty and transport failure outcomes', async () => {
		jsonRpc2.mockResolvedValueOnce(null)
		await expect(getTransactionByHash(transaction.hash)).resolves.toBeNull()

		jsonRpc2.mockRejectedValueOnce(new Error('JSON-RPC rate limited'))
		await expect(getTransactionReceipt(transaction.hash)).rejects.toThrow('rate limited')
	})
})

describe('Envio HyperRPC resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps base discriminators, receipt fields, logs, and exact fee facets', async () => {
		jsonRpc2
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(transactionReceipt)
		const resolver = envioHyperRpc.resolvers[0]
		const resolved = await resolver.resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: transaction.hash,
		}, context)

		expect(Object.keys(resolver.projections).sort()).toEqual([
			'$$logs',
			'$block',
			'$from',
			'$to',
			'Blob',
			'FeeMarket',
			'cumulativeGasUsed',
			'effectiveGasPrice',
			'envelopeType',
			'executionStatus',
			'gas',
			'gasPrice',
			'gasUsed',
			'indexInBlock',
			'input',
			'kind',
			'nonce',
			'r',
			's',
			'v',
			'value',
		].sort())
		expect(Object.keys(resolver.projections.FeeMarket).sort()).toEqual([
			'maxFeePerGas',
			'maxPriorityFeePerGas',
		])
		expect(Object.keys(resolver.projections.Blob).sort()).toEqual([
			'blobGasUsed',
			'maxFeePerBlobGas',
		])
		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 19_046_688n,
				},
			},
			$from: {
				[EntityMetaKey.Selector]: {
					address: transaction.from,
				},
			},
			$to: {
				[EntityMetaKey.Selector]: {
					address: transaction.to,
				},
			},
			value: 1_000_000_000_000_000_000n,
			nonce: 7,
			indexInBlock: 3,
			gas: 21_000n,
			gasUsed: 21_000n,
			cumulativeGasUsed: 1_048_576n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			envelopeType: EvmTransactionEnvelopeType.Blob,
			kind: EvmTransactionKind.NativeTransferAndCall,
			maxFeePerGas: 2_000_000_000n,
			maxPriorityFeePerGas: 1_000_000_000n,
			maxFeePerBlobGas: 100_000_000n,
			blobGasUsed: 131_072n,
			logs: [{
				[EntityMetaKey.Selector]: {
					indexInTransaction: 2,
				},
			}],
		})
		expect(jsonRpc2.mock.calls.every(([binding]) => (
			binding.source === resolverBinding.source
			&& binding.target.kind === resolverBinding.target.kind
			&& binding.target.key === resolverBinding.target.key
		))).toBe(true)
	})

	it('preserves a Slug network selector through referenced entities', async () => {
		jsonRpc2
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(transactionReceipt)
		const slugNetwork = {
			slug: 'ethereum',
		}
		const resolved = await envioHyperRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: slugNetwork,
			txHash: transaction.hash,
		}, context)

		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					$network: slugNetwork,
				},
			},
			logs: [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: slugNetwork,
					},
				},
			}],
		})
	})
})
