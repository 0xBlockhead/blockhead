import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EvmTransactionSelector } from '$/schema/EvmTransaction.ts'
import transaction from '$/sources/Envio/HyperRpc/fixtures/transaction.json'
import transactionReceipt from '$/sources/Envio/HyperRpc/fixtures/transaction-receipt.json'
import {
	getEvmTransactionByHash,
	getEvmTransactionReceipt,
} from '$/sources/Envio/HyperRpc/queries.ts'

const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
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

vi.mock('$/sources/$sourceProviders.ts', () => ({
	sourceProviderDefinitions: [{
		bindings: [{
			source: 'EnvioHyperRpc_JsonRpc',
			target: {
				key: '1',
			},
		}],
	}],
}))

const { default: envioHyperRpc } = await import('$/resolvers/Envio-HyperRpc.ts')

const binding = {
	source: 'EnvioHyperRpc_JsonRpc',
}
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

		await expect(getEvmTransactionByHash(binding, transaction.hash)).resolves.toEqual(transaction)
		await expect(getEvmTransactionReceipt(binding, transaction.hash)).resolves.toEqual(transactionReceipt)
		expect(jsonRpc2.mock.calls).toEqual([
			[
				binding,
				'eth_getTransactionByHash',
				[transaction.hash],
			],
			[
				binding,
				'eth_getTransactionReceipt',
				[transaction.hash],
			],
		])
	})

	it('preserves complete-empty and transport failure outcomes', async () => {
		jsonRpc2.mockResolvedValueOnce(null)
		await expect(getEvmTransactionByHash(binding, transaction.hash)).resolves.toBeNull()

		jsonRpc2.mockRejectedValueOnce(new Error('JSON-RPC rate limited'))
		await expect(getEvmTransactionReceipt(binding, transaction.hash)).rejects.toThrow('rate limited')
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
		const resolved = await resolver.resolve[EvmTransactionSelector.EvmNetworkTxHash].resolve({
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
	})

	it('rejects unsupported networks before either RPC call', async () => {
		await expect(envioHyperRpc.resolvers[0].resolve[EvmTransactionSelector.EvmNetworkTxHash].resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '137',
				},
			},
			txHash: transaction.hash,
		}, context)).rejects.toThrow('unsupported network')
		expect(jsonRpc2).not.toHaveBeenCalled()
	})
})
