import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EvmTransactionEnvelopeType,
	EvmTransactionExecutionStatus,
	EvmTransactionKind,
} from '$/constants/Evm.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const queries = vi.hoisted(() => ({
	getBlockByNumber: vi.fn(),
	getBlockWithTransactionsByNumber: vi.fn(),
	getTransactionByHash: vi.fn(),
	getTransactionReceipt: vi.fn(),
}))

vi.mock('$/sources/ZeroG/Chain/JsonRpc/queries.ts', () => queries)

const { default: zeroGChain } = await import('$/resolvers/ZeroGChain-JsonRpc.ts')

const zeroGResolvers = indexResolvers(
	schema,
	[zeroGChain],
	new Set([Source.ZeroGChain_JsonRpc])
).resolverDefinitions

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '16661',
	},
} as const

const actorAddress = '0xd8da6bf26964af9d7eed9e403e826090792bed6a'
const txHash = '0x2222222222222222222222222222222222222222222222222222222222222222'

const resolverFor = (
	entityType: EntityType,
	projection: string
) => {
	const resolver = zeroGChain.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& projection in candidate.projections
	))
	if (resolver == null)
		throw new Error(`ZeroGChain_JsonRpc spec missing ${entityType}.${projection}`)

	return resolver
}

const expectNetworkApplicability = (reference: string, expected: boolean) => {
	const selectedNetwork = {
		caip2: {
			namespace: 'eip155',
			reference,
		},
	} as const
	const selectors = [
		{ $network: selectedNetwork, blockNumber: 1n },
		{
			$network: selectedNetwork,
			$actor: { address: actorAddress },
		},
		{ $network: selectedNetwork, txHash },
		{ $network: selectedNetwork, blockNumber: 1n },
	] as const
	expect(zeroGResolvers).toHaveLength(selectors.length)

	for (const [index, resolver] of zeroGResolvers.entries())
		expect(resolver.appliesTo(Object.keys(resolver.resolve)[0], selectors[index] ?? {})).toBe(expected)
}

describe('ZeroGChain JSON-RPC source applicability', () => {
	it('excludes Ethereum selectors before invoking 0G-only resolvers', () => {
		expectNetworkApplicability('1', false)
	})

	it('admits selectors for the binding-owned 0G chain', () => {
		expectNetworkApplicability('16661', true)
	})
})

describe('ZeroGChain JSON-RPC resolver I/O', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('maps block wire fields and rejects foreign chains', async () => {
		const blockResolver = resolverFor(EntityType.EvmBlock, 'blockNumber')
		await expect(blockResolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			blockNumber: 1n,
		}, context)).rejects.toThrow('unsupported chain')
		expect(queries.getBlockByNumber).not.toHaveBeenCalled()

		queries.getBlockByNumber.mockResolvedValueOnce({
			number: '0x1',
			parentHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			timestamp: '0x64f0c4a0',
			miner: '0x1111111111111111111111111111111111111111',
			gasUsed: '0x5208',
			gasLimit: '0x1c9c380',
			baseFeePerGas: '0x3b9aca00',
			blobGasUsed: '0x20000',
			excessBlobGas: '0x0',
			transactions: [txHash],
		})

		await expect(blockResolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: network,
			blockNumber: 1n,
		}, context)).resolves.toMatchObject({
			blockNumber: 1n,
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 0n,
				},
			},
			timestamp: 1_693_500_576_000,
			$miner: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			gasUsed: 21_000n,
			gasLimit: 30_000_000n,
			baseFeePerGas: 1_000_000_000n,
			blobGasUsed: 131_072n,
			excessBlobGas: 0n,
			transactionCount: 1,
		})
		expect(queries.getBlockByNumber).toHaveBeenCalledWith(1n)
	})

	it('materializes a current account observation selector without arbitrary timestamp resolution', async () => {
		const accountResolver = resolverFor(EntityType.EvmNetworkAccount, '$$timestamps')
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

		await expect(accountResolver.resolve.EvmNetworkEvmAccount.resolve({
			$network: network,
			$actor: { address: actorAddress },
		}, context)).resolves.toMatchObject({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: network,
						$actor: { address: actorAddress },
					},
					timestampMs: 1_700_000_000_000,
					source: Source.ZeroGChain_JsonRpc,
				},
			}],
		})

		expect(zeroGChain.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmNetworkAccount_Timestamp
		))).toBeUndefined()
	})

	it('maps transaction + receipt ownership and rejects malformed to', async () => {
		const transactionResolver = resolverFor(EntityType.EvmTransaction, 'value')

		queries.getTransactionByHash.mockResolvedValueOnce({
			blockNumber: '0x10',
			from: '0x1111111111111111111111111111111111111111',
			to: '0xbad',
			value: '0x0',
			input: '0x',
			r: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			s: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			v: '0x1',
			gas: '0x5208',
			gasPrice: '0x3b9aca00',
			nonce: '0x3',
			transactionIndex: '0x2',
			type: '0x2',
			maxFeePerGas: '0x77359400',
			maxPriorityFeePerGas: '0x3b9aca00',
		})
		queries.getTransactionReceipt.mockResolvedValueOnce({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			contractAddress: null,
		})
		await expect(transactionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)).rejects.toThrow('invalid to address')

		queries.getTransactionByHash.mockResolvedValueOnce({
			blockNumber: '0x10',
			from: '0x1111111111111111111111111111111111111111',
			to: '0x2222222222222222222222222222222222222222',
			value: '0xde0b6b3a7640000',
			input: '0x1234',
			r: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			s: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			v: '0x1',
			gas: '0x5208',
			gasPrice: '0x3b9aca00',
			nonce: '0x3',
			transactionIndex: '0x2',
			type: '0x2',
			maxFeePerGas: '0x77359400',
			maxPriorityFeePerGas: '0x3b9aca00',
		})
		queries.getTransactionReceipt.mockResolvedValueOnce({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			contractAddress: null,
		})

		const resolved = await transactionResolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)

		expect(Object.keys(transactionResolver.projections).sort()).toEqual([
			'$block',
			'$from',
			'$to',
			'Blob',
			'ContractCreation',
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
		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 16n,
				},
			},
			$from: {
				[EntityMetaKey.Selector]: {
					address: '0x1111111111111111111111111111111111111111',
				},
			},
			$to: {
				[EntityMetaKey.Selector]: {
					address: '0x2222222222222222222222222222222222222222',
				},
			},
			value: 1_000_000_000_000_000_000n,
			nonce: 3,
			indexInBlock: 2,
			gas: 21_000n,
			gasUsed: 21_000n,
			cumulativeGasUsed: 21_000n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			envelopeType: EvmTransactionEnvelopeType.FeeMarket,
			kind: EvmTransactionKind.NativeTransferAndCall,
			maxFeePerGas: 2_000_000_000n,
			maxPriorityFeePerGas: 1_000_000_000n,
		})
	})

	it('caps block $$transactions by resolver context row limit', async () => {
		const transactionsResolver = resolverFor(EntityType.EvmBlock, '$$transactions')
		queries.getBlockWithTransactionsByNumber.mockResolvedValueOnce({
			transactions: Array.from({ length: 3 }, (_value, index) => ({
				hash: `0x${String(index + 1).padStart(64, '0')}`,
			})),
		})

		await expect(transactionsResolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: network,
			blockNumber: 1n,
		}, {
			...context,
			pagination: {
				limit: 2,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: '0x0000000000000000000000000000000000000000000000000000000000000002',
				},
			},
		])
		expect(queries.getBlockWithTransactionsByNumber).toHaveBeenCalledWith(1n)
	})
})
