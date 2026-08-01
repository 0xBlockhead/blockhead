import { beforeEach, describe, expect, it, vi } from 'vitest'

import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { schema } from '$/schema/index.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { Source } from '$/sources/Source.ts'
import type {
	BlockscoutAddress,
	BlockscoutTransactionLog,
	BlockscoutUserOperationListItem,
} from '$/sources/Blockscout/Rest/types.ts'

const getAddressDetails = vi.hoisted(() => vi.fn())
const getErc4337SmartAccountList = vi.hoisted(() => vi.fn())
const getStats = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionLogs = vi.hoisted(() => vi.fn())
const getUserOperationsPage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Blockscout/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Blockscout/Rest/queries.ts')>(),
	getAddressDetails,
	getErc4337SmartAccountList,
	getStats,
	getTransactionByHash,
	getTransactionLogs,
	getUserOperationsPage,
}))

const { default: blockscoutRest } = await import('$/resolvers/Blockscout-Rest.ts')

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
		reference: '1',
	},
}
const txHash = '0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca'
const contract = {
	$network: network,
	address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
}
const blockscoutAddress = {
	ens_domain_name: null,
	hash: '0x3333333333333333333333333333333333333333',
	implementations: [],
	is_contract: false,
	is_scam: false,
	is_verified: null,
	metadata: null,
	name: null,
	proxy_type: null,
	reputation: 'ok',
} as const satisfies BlockscoutAddress
const receiptLogs = [
	{
		address: blockscoutAddress,
		block_hash: txHash,
		block_number: 12,
		block_timestamp: null,
		decoded: null,
		index: 981,
		smart_contract: null,
		transaction_hash: txHash,
		topics: ['0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'],
		data: '0x01',
	},
	{
		address: {
			...blockscoutAddress,
			hash: '0x4444444444444444444444444444444444444444',
		},
		block_hash: txHash,
		block_number: 12,
		block_timestamp: null,
		decoded: null,
		index: 982,
		smart_contract: null,
		transaction_hash: txHash,
		topics: ['0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'],
		data: '0x02',
	},
] as const satisfies BlockscoutTransactionLog[]

describe('Blockscout EVM coin instances', () => {
	it('indexes only ERC-20 facet parts, leaving native selectors without a Blockscout part', () => {
		const parts = indexResolvers(
			schema,
			[blockscoutRest],
			new Set([Source.Blockscout_Rest])
		).resolverParts.filter((part) => part.entityType === EntityType.EvmCoinInstance)

		expect(parts.map((part) => [
			part.facetPath,
			part.fieldName,
		])).toEqual([
			[['Erc20Token'], 'coinId'],
			[['Erc20Token'], 'name'],
			[['Erc20Token'], 'symbol'],
			[['Erc20Token'], 'decimals'],
			[['Erc20Token'], 'iconUrl'],
		])
		expect(parts.every((part) => (
			part.resolver.resolve['NetworkType'] == null
		))).toBe(true)
	})

	it('resolves ERC-20 name and symbol from contract token metadata', async () => {
		getAddressDetails.mockResolvedValue({
			token: {
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: '6',
			},
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmCoinInstance
		))
		if (resolver == null)
			throw new Error('Blockscout EvmCoinInstance resolver is not registered')

		const resolved = await resolver.resolve['NetworkTypeContract'].resolve({
			$network: network,
			type: CoinInstanceType.Erc20Token,
			$contract: contract,
		}, context)

		expect(getAddressDetails).toHaveBeenCalledWith(expect.objectContaining({
			address: contract.address,
		}))
		expect(resolver.projections).not.toHaveProperty('$contract')
		expect(resolver.projections.Erc20Token.name(resolved, resolved[EntityMetaKey.Selector], context)).toBe('USD Coin')
		expect(resolver.projections.Erc20Token.symbol(resolved, resolved[EntityMetaKey.Selector], context)).toBe('USDC')
	})
})

describe('Blockscout Network account abstraction applicability', () => {
	it.each([
		'$$erc4337SmartAccounts',
		'$$userOperations',
	])('resolves %s empty without requesting an unsupported hosted chain', async (fieldName) => {
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& fieldName in candidate.projections.Evm
		))
		if (resolver == null)
			throw new Error(`Blockscout ${fieldName} resolver is not registered`)

		await expect(resolver.resolve['Caip2'].resolve({
			caip2: {
				namespace: 'eip155',
				reference: '5',
			},
		}, context)).resolves.toEqual([])
	})

	it('materializes the official user-operation list response', async () => {
		getUserOperationsPage.mockResolvedValue([
			{
				address: blockscoutAddress,
				block_number: '12',
				entry_point: blockscoutAddress,
				entry_point_version: 'v0.7',
				fee: '12',
				hash: txHash,
				status: true,
				timestamp: '2026-07-30T00:00:00.000Z',
				transaction_hash: txHash,
			},
		] satisfies BlockscoutUserOperationListItem[])
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$userOperations' in candidate.projections.Evm
		))
		if (resolver == null)
			throw new Error('Blockscout Network user-operation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve(network, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				hash: txHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'successful')]: true,
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'timestampMs')]: 1_785_369_600_000,
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'fee')]: '12',
			},
		}])
	})
})

describe('Blockscout gas estimate observation identity', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		network,
		{
			slug: 'ethereum',
		},
	])('resolves CAIP-2 and slug network selectors', async ($network) => {
		getStats.mockResolvedValue({
			gas_prices: {
				slow: 1,
				average: 2,
				fast: 3,
			},
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetwork_GasEstimate_Timestamp
		))
		if (resolver == null)
			throw new Error('Blockscout gas estimate resolver is not registered')

		await expect(resolver.resolve['NetworkTimestampMsSource'].resolve({
			$network,
			timestampMs: 1_784_221_554_477,
			source: Source.Blockscout_Rest,
		}, context)).resolves.toMatchObject({
			slowGwei: 1,
			averageGwei: 2,
			fastGwei: 3,
			transport: 'blockscout-stats',
		})
	})

	it('keeps a provider-supplied stats clock strict', async () => {
		getStats.mockResolvedValue({
			gas_price_updated_at: '2026-07-16T09:30:43.020Z',
			gas_prices: {
				average: 2,
			},
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetwork_GasEstimate_Timestamp
		))
		if (resolver == null)
			throw new Error('Blockscout gas estimate resolver is not registered')

		await expect(resolver.resolve['NetworkTimestampMsSource'].resolve({
			$network: network,
			timestampMs: 1,
			source: Source.Blockscout_Rest,
		}, context)).rejects.toThrow('id does not match stats clock')
	})
})

describe('Blockscout EVM log identity', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getTransactionLogs.mockResolvedValue(receiptLogs)
		getTransactionByHash.mockResolvedValue({
			block_number: 12,
			hash: txHash,
			from: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			gas_limit: '30000',
			gas_price: '4',
			gas_used: '21000',
			max_fee_per_gas: '6',
			max_priority_fee_per_gas: '2',
			nonce: 7,
			position: 3,
			raw_input: '0x1234',
			to: {
				hash: '0x2222222222222222222222222222222222222222',
			},
			status: 'ok',
			type: 2,
			value: '0',
		})
	})

	it('emits transaction-local selectors for receipt logs with block-global wire indices', async () => {
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& '$$logs' in candidate.projections
			&& 'value' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Blockscout EvmTransaction receipt resolver is not registered')

		const resolved = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)

		expect(resolved.$$logs.map((log) => (
			log[EntityMetaKey.Selector].indexInTransaction
		))).toEqual([
			0,
			1,
		])
		expect(resolved).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				txHash,
			},
			indexInBlock: 3,
			value: 0n,
			nonce: 7,
			input: '0x1234',
			gas: 30_000n,
			gasPrice: 4n,
			maxFeePerGas: 6n,
			maxPriorityFeePerGas: 2n,
			gasUsed: 21_000n,
			effectiveGasPrice: 4n,
		})
		expect(resolved.$$logs[0]).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 12n,
				},
			},
			topic0: receiptLogs[0].topics[0],
			data: '0x01',
			$emitter: {
				[EntityMetaKey.Selector]: {
					$network: network,
					address: '0x3333333333333333333333333333333333333333',
				},
			},
		})
	})

	it('selects a receipt log by its transaction-local ordinal, not block-global logIndex', async () => {
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmLog
			&& 'topic0' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Blockscout EvmLog resolver is not registered')

		const resolved = await resolver.resolve['TransactionIndexInTransaction'].resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			indexInTransaction: 1,
		}, context)

		expect(getTransactionLogs).toHaveBeenCalledWith(expect.objectContaining({
			txHash,
		}))
		expect(resolved).toMatchObject({
			[EntityMetaKey.Selector]: {
				indexInTransaction: 1,
			},
			$block: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 12n,
				},
			},
			topic0: receiptLogs[1].topics[0],
			data: '0x02',
		})
	})
})
