import { beforeEach, describe, expect, it, vi } from 'vitest'

import { envioHyperRpc as envioHyperRpcQuery } from '$/sources/Envio/HyperRpc/queries.ts'
import { Source } from '$/sources/Source.ts'

import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import block from '$/sources/Envio/HyperRpc/fixtures/block.json'
import transaction from '$/sources/Envio/HyperRpc/fixtures/transaction.json'
import transactionReceipt from '$/sources/Envio/HyperRpc/fixtures/transaction-receipt.json'
const {
	getBlockByHash,
	getBlockByNumber,
	getBlockNumber,
	getTransactionByHash,
	getTransactionReceipt,
} = envioHyperRpcQuery

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
	pagination: {
		limit: 3,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const resolverFor = (entityType: string) => (
	envioHyperRpc.resolvers.find((resolver) => resolver.entityType === entityType)
)

describe('Envio HyperRPC query boundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('executes the approved read-only JSON-RPC methods', async () => {
		jsonRpc2
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(transactionReceipt)
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce('0x122a134')

		await expect(getTransactionByHash({ txHash: transaction.hash })).resolves.toEqual(transaction)
		await expect(getTransactionReceipt({ txHash: transaction.hash })).resolves.toEqual(transactionReceipt)
		await expect(getBlockByNumber({
			blockNumber: 19_046_688n,
			txObjects: false,
		})).resolves.toEqual(block)
		await expect(getBlockByHash({
			blockHash: block.hash,
			txObjects: false,
		})).resolves.toEqual(block)
		await expect(getBlockNumber()).resolves.toBe(19_046_708n)
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
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			3,
			expect.objectContaining({ source: resolverBinding.source }),
			'eth_getBlockByNumber',
			['0x122a120', false],
			undefined
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			4,
			expect.objectContaining({ source: resolverBinding.source }),
			'eth_getBlockByHash',
			[block.hash, false],
			undefined
		)
		expect(jsonRpc2).toHaveBeenNthCalledWith(
			5,
			expect.objectContaining({ source: resolverBinding.source }),
			'eth_blockNumber',
			undefined,
			undefined
		)
	})

	it('preserves complete-empty and transport failure outcomes', async () => {
		jsonRpc2.mockResolvedValueOnce(null)
		await expect(getTransactionByHash({ txHash: transaction.hash })).resolves.toBeNull()

		jsonRpc2.mockRejectedValueOnce(new Error('JSON-RPC rate limited'))
		await expect(getTransactionReceipt({ txHash: transaction.hash })).rejects.toThrow('rate limited')

		jsonRpc2.mockResolvedValueOnce(null)
		await expect(getBlockByNumber({
			blockNumber: 19_046_688n,
			txObjects: false,
		})).resolves.toBeNull()
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
		const resolver = resolverFor(EntityType.EvmTransaction)
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
				$$topics: [{
					[EntityMetaKey.Selector]: {
						hex: transactionReceipt.logs[0].topics[0],
					},
				}],
				topic0: transactionReceipt.logs[0].topics[0],
				data: '0x',
				removed: false,
				$emitter: {
					[EntityMetaKey.Selector]: {
						address: transactionReceipt.logs[0].address,
					},
				},
			}],
		})
		expect(resolver.projections.$$logs.resolveCount(resolved)).toBe(1)
		expect(jsonRpc2.mock.calls.every(([binding]) => (
			binding.source === resolverBinding.source
			&& binding.target.kind === resolverBinding.target.kind
			&& binding.target.key === resolverBinding.target.key
		))).toBe(true)
	})

	it('resolves native receipt logs with block, emitter, topics, and event identity', async () => {
		jsonRpc2.mockResolvedValueOnce(transactionReceipt)
		const resolver = resolverFor(EntityType.EvmLog)
		const resolved = await resolver.resolve['TransactionIndexInTransaction'].resolve({
			$transaction: {
				$network: network,
				txHash: transaction.hash,
			},
			indexInTransaction: 2,
		}, context)

		expect(Object.keys(resolver.projections).sort()).toEqual([
			'$$topics',
			'$block',
			'$emitter',
			'$transaction',
			'Event',
			'data',
			'indexInTransaction',
			'removed',
			'topic0',
		].sort())
		expect(resolved).toMatchObject({
			[EntityMetaKey.Selector]: {
				indexInTransaction: 2,
			},
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 19_046_688n,
				},
			},
			$$topics: [{
				[EntityMetaKey.Selector]: {
					hex: transactionReceipt.logs[0].topics[0],
				},
			}],
			topic0: transactionReceipt.logs[0].topics[0],
			data: transactionReceipt.logs[0].data,
			removed: false,
			$emitter: {
				[EntityMetaKey.Selector]: {
					address: transactionReceipt.logs[0].address,
				},
			},
		})
		expect(resolver.projections.$$topics.resolveCount(resolved)).toBe(1)
		expect(resolver.projections.Event.signatureHash(resolved)).toBe(transactionReceipt.logs[0].topics[0])
	})

	it('fails closed when a receipt log identity conflicts with its requested transaction', async () => {
		jsonRpc2.mockResolvedValueOnce({
			...transactionReceipt,
			logs: [{
				...transactionReceipt.logs[0],
				transactionHash: `0x${'ff'.repeat(32)}`,
			}],
		})

		await expect(resolverFor(EntityType.EvmLog).resolve['TransactionIndexInTransaction'].resolve({
			$transaction: {
				$network: network,
				txHash: transaction.hash,
			},
			indexInTransaction: 2,
		}, context)).rejects.toThrow('does not match the requested transaction')
	})

	it('decodes an ERC-20 receipt event into a native token transfer child', async () => {
		const transferReceipt = {
			...transactionReceipt,
			logs: [{
				...transactionReceipt.logs[0],
				topics: [
					'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
					`0x${'0'.repeat(24)}${'11'.repeat(20)}`,
					`0x${'0'.repeat(24)}${'22'.repeat(20)}`,
				],
				data: `0x${'0'.repeat(63)}a`,
			}],
		}
		jsonRpc2
			.mockResolvedValueOnce(transferReceipt)
			.mockResolvedValueOnce(transferReceipt)
		const logSelector = {
			$transaction: {
				$network: network,
				txHash: transaction.hash,
			},
			indexInTransaction: 2,
		}
		const log = await resolverFor(EntityType.EvmLog).resolve['TransactionIndexInTransaction'].resolve(
			logSelector,
			context
		)

		expect(log.$$tokenTransfers).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$log: logSelector,
				indexInLog: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-20',
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: 10n,
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')]: {
					[EntityMetaKey.Selector]: { address: `0x${'11'.repeat(20)}` },
				},
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')]: {
					[EntityMetaKey.Selector]: { address: `0x${'22'.repeat(20)}` },
				},
			},
		}])
		const transferProjection = resolverFor(EntityType.EvmLog).projections.Event.TokenTransfer.$$tokenTransfers
		expect(transferProjection.resolveCount(log)).toBe(1)
		expect(transferProjection.select(log)).toHaveLength(1)

		await expect(resolverFor(EntityType.EvmTokenTransfer).resolve['LogIndexInLog'].resolve({
			$log: logSelector,
			indexInLog: 0,
		}, context)).resolves.toMatchObject({
			[EntityMetaKey.Selector]: {
				$log: logSelector,
				indexInLog: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-20',
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: 10n,
			},
		})
	})

	it('preserves a Slug network selector through referenced entities', async () => {
		jsonRpc2
			.mockResolvedValueOnce(transaction)
			.mockResolvedValueOnce(transactionReceipt)
		const slugNetwork = {
			slug: 'ethereum',
		}
		const resolved = await resolverFor(EntityType.EvmTransaction).resolve['EvmNetworkTxHash'].resolve({
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

	it('maps schema-shaped EVM blocks by number and hash', async () => {
		jsonRpc2
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce(block)
		const resolver = resolverFor(EntityType.EvmBlock)
		const byNumber = await resolver.resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 19_046_688n,
		}, context)
		const byHash = await resolver.resolve['EvmNetworkBlockHash'].resolve({
			$network: network,
			hash: block.hash,
		}, context)

		expect(Object.keys(resolver.projections).sort()).toEqual([
			'$$transactions',
			'$miner',
			'$parent',
			'baseFeePerGas',
			'blobGasUsed',
			'excessBlobGas',
			'gasLimit',
			'gasUsed',
			'hash',
			'parentHash',
			'timestamp',
			'transactionCount',
		].sort())
		expect(byNumber).toMatchObject({
			hash: block.hash,
			parentHash: block.parentHash,
			timestamp: 1_700_000_000_000,
			gasUsed: 21_000n,
			transactionCount: 1,
			$miner: {
				[EntityMetaKey.Selector]: {
					address: block.miner,
				},
			},
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_046_687n,
				},
			},
			transactions: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: block.transactions[0],
				},
			}],
		})
		expect(byHash).toMatchObject({
			hash: block.hash,
			transactions: [{
				[EntityMetaKey.Selector]: {
					txHash: block.transactions[0],
				},
			}],
		})
	})

	it('hard-fails unsupported networks and missing blocks', async () => {
		await expect(resolverFor(EntityType.EvmBlock).resolve['EvmNetworkBlockNumber'].resolve({
			$network: {
				slug: 'polygon',
			},
			blockNumber: 1n,
		}, context)).rejects.toThrow('unsupported network')

		jsonRpc2.mockResolvedValueOnce(null)
		await expect(resolverFor(EntityType.EvmBlock).resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 19_046_688n,
		}, context)).rejects.toThrow('not found')
	})

	it('projects Network.Evm tip $$blocks / resolveCount / $$timestamps from eth_blockNumber', async () => {
		jsonRpc2.mockResolvedValueOnce('0x122a134')
		const blocksResolver = resolverFor(EntityType.Network)
		const blocks = await blocksResolver.resolve.Caip2.resolve(network, {
			...context,
			pagination: {
				limit: 3,
				offset: 2,
			},
		})
		expect(blocksResolver.projections.Evm.$$blocks.select(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_046_706n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_046_705n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 19_046_704n,
				},
			},
		])
		expect(blocksResolver.projections.Evm.$$blocks.continuation(blocks).token).toBe('19046703')

		jsonRpc2.mockResolvedValueOnce('0x122a136')
		const continuedBlocks = await blocksResolver.resolve.Caip2.resolve(network, {
			...context,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '19046703',
		})
		expect(blocksResolver.projections.Evm.$$blocks.select(continuedBlocks)[0][EntityMetaKey.Selector].blockNumber).toBe(19_046_703n)
		expect(blocksResolver.projections.Evm.$$blocks.continuation(continuedBlocks).token).toBe('19046702')

		jsonRpc2.mockResolvedValueOnce('0x122a134')
		const countResolver = envioHyperRpc.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$blocks != null
			&& typeof resolver.projections.Evm.$$blocks === 'object'
			&& 'resolveCount' in resolver.projections.Evm.$$blocks
		))
		await expect(countResolver.resolve.Caip2.resolve(network, context)).resolves.toBe(19_046_709)

		jsonRpc2
			.mockResolvedValueOnce('0x122a134')
			.mockResolvedValueOnce({
				...block,
				number: '0x122a134',
			})
		const timestamps = await envioHyperRpc.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$timestamps != null
		)).resolve.Caip2.resolve(network, context)
		expect(timestamps).toHaveLength(1)
		expect(timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_700_000_000_000,
				source: Source.EnvioHyperRpc_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: 19_046_708n,
			},
		})

		expect(resolverFor(EntityType.EvmNetwork_Timestamp)).toBeUndefined()
	})
})
