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
const getAddressCounters = vi.hoisted(() => vi.fn())
const getAddressCoinBalanceHistory = vi.hoisted(() => vi.fn())
const getAddressTokenBalances = vi.hoisted(() => vi.fn())
const getAddressTransactions = vi.hoisted(() => vi.fn())
const getBlocks = vi.hoisted(() => vi.fn())
const getBlockByNumber = vi.hoisted(() => vi.fn())
const getErc4337BundlerDetail = vi.hoisted(() => vi.fn())
const getErc4337SmartAccountList = vi.hoisted(() => vi.fn())
const getStats = vi.hoisted(() => vi.fn())
const getSmartContracts = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionLogs = vi.hoisted(() => vi.fn())
const getTransactionRawTrace = vi.hoisted(() => vi.fn())
const getUserOperationsPage = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Blockscout/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Blockscout/Rest/queries.ts')>(),
	getAddressDetails,
	getAddressCounters,
	getAddressCoinBalanceHistory,
	getAddressTokenBalances,
	getAddressTransactions,
	getBlocks,
	getBlockByNumber,
	getErc4337BundlerDetail,
	getErc4337SmartAccountList,
	getStats,
	getSmartContracts,
	getTransactionByHash,
	getTransactionLogs,
	getTransactionRawTrace,
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
	it('materializes stable transaction facts and created contracts in account activity without detail reads', async () => {
		const createdContract = '0x4444444444444444444444444444444444444444'
		getAddressTransactions.mockResolvedValueOnce([{
			from: { hash: blockscoutAddress.hash },
			to: { hash: '0x2222222222222222222222222222222222222222' },
			gas_limit: '21000',
			gas_price: '1',
			gas_used: '21000',
			hash: txHash,
			nonce: 4,
			raw_input: '0x',
			value: '42',
			type: 2,
			status: 'ok',
			block_number: 12,
			position: 3,
			created_contract: { hash: createdContract },
		}])
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkAccount
			&& typeof candidate.projections.$$transactions === 'function'
		))
		if (resolver == null) throw new Error('missing account transaction resolver')
		const rows = await resolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: { address: blockscoutAddress.hash },
			$network: network,
		}, context)

		expect(resolver.projections.$$transactions(rows)[0]).toMatchObject({
			[EntityMetaKey.Selector]: { $network: network, txHash },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'envelopeType')]: 'FeeMarket',
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'kind')]: 'ContractCreation',
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'value')]: 42n,
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'executionStatus')]: 'Success',
				[entityFieldAddressKey(EntityType.EvmTransaction, [], 'indexInBlock')]: 3,
				[entityFieldAddressKey(EntityType.EvmTransaction, ['ContractCreation'], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: createdContract,
					},
				},
			},
		})
		expect(getTransactionByHash).not.toHaveBeenCalled()
	})

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

	it.each([
		'$$erc4337Bundlers',
		'$$erc4337Paymasters',
		'$$erc4337AccountFactories',
	])('omits Network %s rather than soft-emptying timed-out registry lists', (fieldName) => {
		expect(blockscoutRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType.Network
			&& fieldName in candidate.projections.Evm
		))).toBe(false)
	})

	it('materializes bundler detail timestamps from total_ops', async () => {
		getErc4337BundlerDetail.mockResolvedValue({
			address: blockscoutAddress,
			total_bundles: 2,
			total_ops: 9,
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Erc4337Bundler
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Blockscout Erc4337Bundler timestamp resolver is not registered')

		const entitySelector = {
			$network: network,
			address: contract.address,
		}
		const resolved = await resolver.resolve.EvmNetworkAddress.resolve(entitySelector, context)
		expect(getErc4337BundlerDetail).toHaveBeenCalledWith({
			chainId: 1,
			address: contract.address,
		})
		expect(resolved.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$bundler: entitySelector,
				timestampMs: expect.any(Number),
				source: Source.Blockscout_Rest,
			},
			userOperationsCount: 9,
		}])
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
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$sender')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: blockscoutAddress.hash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$entryPoint')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: blockscoutAddress.hash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$bundledTransaction')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						txHash,
					},
				},
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						blockNumber: 12n,
					},
				},
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'entryPointVersion')]: 'v0.7',
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'timestampMs')]: 1_785_369_600_000,
				[entityFieldAddressKey(EntityType.EvmUserOperation, [], 'fee')]: '12',
			},
		}])
	})

	it('materializes smart-account contract, factory and lifecycle hierarchy from the registry row', async () => {
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$erc4337SmartAccounts' in candidate.projections.Evm
		))
		if (resolver == null || !('Caip2' in resolver.resolve))
			throw new Error('Blockscout smart-account registry resolver is not registered')

		getErc4337SmartAccountList.mockResolvedValueOnce([{
			address: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			creation_op_hash: txHash,
			creation_timestamp: '2026-07-16T09:30:43.020Z',
			creation_transaction_hash: txHash,
			factory: {
				hash: '0x2222222222222222222222222222222222222222',
			},
			total_ops: 17,
		}])

		await expect(resolver.resolve.Caip2.resolve(network, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				address: '0x1111111111111111111111111111111111111111',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], '$contract')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: '0x1111111111111111111111111111111111111111',
					},
				},
				[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], '$factory')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: '0x2222222222222222222222222222222222222222',
					},
				},
				[entityFieldAddressKey(EntityType.Erc4337SmartAccount, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$account: {
							$network: network,
							address: '0x1111111111111111111111111111111111111111',
						},
						timestampMs: Date.parse('2026-07-16T09:30:43.020Z'),
						source: Source.Blockscout_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.Erc4337SmartAccount_Timestamp, [], 'userOperationsCount')]: 17,
					},
				}],
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

describe('Blockscout raw EVM trace hierarchy', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves the source trace tree as native transaction-local EVM traces', async () => {
		getTransactionByHash.mockResolvedValue({
			revert_reason: {
				raw: 'execution reverted: insufficient balance',
			},
		})
		getTransactionRawTrace.mockResolvedValue([
			{
				action: {
					from: '0x1111111111111111111111111111111111111111',
					gas: '0x5208',
					input: '0x',
					to: '0x2222222222222222222222222222222222222222',
					value: '0x0',
				},
				result: {
					gasUsed: '0x5208',
					output: '0x',
				},
				subtraces: 1,
				traceAddress: [],
				type: 'call',
			},
			{
				action: {
					callType: 'delegatecall',
					from: '0x2222222222222222222222222222222222222222',
					gas: '0x100',
					input: '0x1234',
					to: '0x3333333333333333333333333333333333333333',
					value: '0x0',
				},
				subtraces: 0,
				traceAddress: [0],
					type: 'call',
			},
		])
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& '$$traces' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Blockscout EvmTransaction trace resolver is not registered')

		const resolved = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)

		expect(getTransactionRawTrace).toHaveBeenCalledWith({
			chainId: 1,
			txHash,
		})
		expect(resolved.map((trace) => trace[EntityMetaKey.Selector].traceAddress)).toEqual([
			'root',
			'0',
		])
		expect(resolved[0]).toMatchObject({
			index: 0,
			type: 'Call',
			value: 0n,
			gas: 21_000n,
			gasUsed: 21_000n,
			error: 'execution reverted: insufficient balance',
			$$children: [{
				[EntityMetaKey.Selector]: {
					traceAddress: '0',
				},
			}],
		})
		expect(resolved[1]).toMatchObject({
			index: 0,
			type: 'DelegateCall',
			input: '0x1234',
		})
	})

	it('retains a decoded root revert label without assigning it to successful child frames', async () => {
		getTransactionByHash.mockResolvedValue({
			revert_reason: {
				method_call: 'Unauthorized(address)',
				method_id: '0x8e4a23d6',
				parameters: [],
			},
		})
		getTransactionRawTrace.mockResolvedValue([
			{
				action: {
					from: '0x1111111111111111111111111111111111111111',
					gas: '0x5208',
					input: '0x',
					to: '0x2222222222222222222222222222222222222222',
					value: '0x0',
				},
				subtraces: 1,
				traceAddress: [],
				type: 'call',
			},
			{
				action: {
					from: '0x2222222222222222222222222222222222222222',
					gas: '0x100',
					input: '0x',
					to: '0x3333333333333333333333333333333333333333',
					value: '0x0',
				},
				result: {
					gasUsed: '0x10',
					output: '0x',
				},
				subtraces: 0,
				traceAddress: [0],
				type: 'call',
			},
		])
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& '$$traces' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Blockscout EvmTransaction trace resolver is not registered')

		const resolved = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)

		expect(resolved[0]).toMatchObject({
			error: 'Unauthorized(address)',
		})
		expect(resolved[1]).not.toHaveProperty('error')
	})
})

describe('Blockscout_Rest balance observations', () => {
	const address = '0x1111111111111111111111111111111111111111'
	const tokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
	const tipTimestamp = '2026-01-01T00:00:00.000Z'
	const tipTimestampMs = Math.floor(Date.parse(tipTimestamp) / 1_000) * 1_000

	const balanceResolver = blockscoutRest.resolvers.find((resolver) => (
		resolver.entityType === EntityType.EvmNetworkActorCoinBalance
		&& '$$timestamps' in resolver.projections
	))
	const balanceTimestampResolver = blockscoutRest.resolvers.find((resolver) => (
		resolver.entityType === EntityType.EvmNetworkActorCoinBalance_Timestamp
	))
	const ownedCoinsResolver = blockscoutRest.resolvers.find((resolver) => (
		resolver.entityType === EntityType.EvmNetworkAccount
		&& '$$ownedCoins' in resolver.projections
	))

	if (balanceResolver == null || balanceTimestampResolver == null || ownedCoinsResolver == null)
		throw new Error('Blockscout_Rest spec missing balance observation resolvers')

	beforeEach(() => {
		getAddressDetails.mockReset()
		getAddressCoinBalanceHistory.mockReset()
		getAddressTokenBalances.mockReset()
		getBlocks.mockReset()
		getBlockByNumber.mockReset()
	})

	it('lists native + ERC-20 owned coins and projects tip observations', async () => {
		getAddressDetails.mockResolvedValue({
			coin_balance: '2000000000000000000',
			block_number_balance_updated_at: 22_800_000,
			exchange_rate: '3200.5',
		})
		getAddressTokenBalances.mockResolvedValue([
			{
				token: {
					address_hash: tokenAddress,
					type: 'ERC-20',
					symbol: 'USDC',
					decimals: '6',
					exchange_rate: '1',
				},
				token_id: null,
				value: '1000000',
			},
			{
				token: {
					address_hash: '0x2222222222222222222222222222222222222222',
					type: 'ERC-721',
					symbol: 'NFT',
					decimals: '0',
				},
				token_id: '1',
				value: '1',
			},
		])
		getAddressCoinBalanceHistory.mockResolvedValue([
			{
				block_number: 22_800_000,
				block_timestamp: tipTimestamp,
				value: '2000000000000000000',
			},
		])
		getBlocks.mockResolvedValue([
			{
				height: 22_800_001,
			},
		])
		getBlockByNumber.mockResolvedValue({
			hash: txHash,
			height: 22_800_001,
			miner: {
				hash: address,
			},
			parent_hash: txHash,
			timestamp: tipTimestamp,
			transactions_count: 1,
		})

		const owned = await ownedCoinsResolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, context)
		expect(owned).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$actor: {
						address,
					},
					$network: network,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$actor: {
						address,
					},
					$contract: {
						$network: network,
						address: tokenAddress,
					},
				},
			},
		])

		const native = await balanceResolver.resolve.EvmAccountNativeCoinInstance.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, context)
		expect(native).toMatchObject({
			symbol: 'ETH',
			decimals: 18,
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					type: CoinInstanceType.NativeCurrency,
				},
			},
		})
		expect(balanceResolver.projections.$$timestamps(native)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actorCoin: {
					$actor: {
						address,
					},
					$network: network,
				},
				timestampMs: tipTimestampMs,
				source: Source.Blockscout_Rest,
			},
		}])

		const nativeObservation = await balanceTimestampResolver.resolve.ActorCoinTimestampMsSource.resolve({
			$actorCoin: {
				$actor: {
					address,
				},
				$network: network,
			},
			timestampMs: tipTimestampMs,
			source: Source.Blockscout_Rest,
		}, context)
		expect(balanceTimestampResolver.projections.balance(nativeObservation)).toBe(2_000_000_000_000_000_000n)
		expect(balanceTimestampResolver.projections.blockNumber(nativeObservation)).toBe(22_800_000n)
		expect(balanceTimestampResolver.projections.priceUsd(nativeObservation)).toBe(3200.5)

		const erc20 = await balanceResolver.resolve.EvmAccountErc20CoinInstance.resolve({
			$actor: {
				address,
			},
			$contract: {
				$network: network,
				address: tokenAddress,
			},
		}, context)
		expect(erc20).toMatchObject({
			symbol: 'USDC',
			decimals: 6,
		})
		expect(balanceResolver.projections.$$timestamps(erc20)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actorCoin: {
					$actor: {
						address,
					},
					$contract: {
						$network: network,
						address: tokenAddress,
					},
				},
				timestampMs: tipTimestampMs,
				source: Source.Blockscout_Rest,
			},
		}])
	})

	it('hard-fails incomplete ERC-20 tip clocks instead of soft-emptying', async () => {
		getAddressTokenBalances.mockResolvedValue([
			{
				token: {
					address_hash: tokenAddress,
					type: 'ERC-20',
					symbol: 'USDC',
					decimals: '6',
				},
				value: '1',
			},
		])
		getBlocks.mockResolvedValue([])

		await expect(balanceResolver.resolve.EvmAccountErc20CoinInstance.resolve({
			$actor: {
				address,
			},
			$contract: {
				$network: network,
				address: tokenAddress,
			},
		}, context)).rejects.toThrow('tip block missing for balance observation clock')
	})
})

describe('Blockscout_Rest network blocks', () => {
	const blocksResolver = blockscoutRest.resolvers.find((candidate) => (
		candidate.entityType === EntityType.Network
		&& 'Evm' in candidate.projections
		&& '$$blocks' in candidate.projections.Evm
		&& typeof candidate.projections.Evm.$$blocks === 'function'
		&& 'Caip2' in candidate.resolve
	))

	if (blocksResolver == null || !('Caip2' in blocksResolver.resolve))
		throw new Error('Blockscout_Rest: missing Network.Evm.$$blocks resolver')

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes endpoint-native block facts without block detail reads', async () => {
		getBlocks.mockResolvedValue([{
			base_fee_per_gas: '1000000000',
			gas_limit: '30000000',
			gas_used: '15000000',
			hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			height: 12,
			miner: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			parent_hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			timestamp: '2024-01-02T03:04:05.432Z',
			transactions_count: 3,
		}])

		const blocks = await blocksResolver.resolve.Caip2.resolve(network, context)
		expect(blocks).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 12n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'hash')]: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'blockNumber')]: 12n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'parentHash')]: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'timestamp')]: Date.parse('2024-01-02T03:04:05.000Z'),
				[entityFieldAddressKey(EntityType.EvmBlock, [], '$miner')]: {
					[EntityMetaKey.Selector]: {
						address: '0x1111111111111111111111111111111111111111',
					},
				},
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasUsed')]: 15000000n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'gasLimit')]: 30000000n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'baseFeePerGas')]: 1000000000n,
				[entityFieldAddressKey(EntityType.EvmBlock, [], 'transactionCount')]: 3,
			},
		}])
		expect(getBlockByNumber).not.toHaveBeenCalled()
	})
})

describe('Blockscout_Rest verified contracts', () => {
	const contractsResolver = blockscoutRest.resolvers.find((candidate) => (
		candidate.entityType === EntityType.Network
		&& 'Evm' in candidate.projections
		&& '$$contracts' in candidate.projections.Evm
		&& 'Caip2' in candidate.resolve
	))

	if (contractsResolver == null || !('Caip2' in contractsResolver.resolve))
		throw new Error('Blockscout_Rest: missing Network.Evm.$$contracts resolver')

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes verification and compilation hierarchy without contract detail reads', async () => {
		getSmartContracts.mockResolvedValue([{
			address: {
				hash: contract.address,
			},
			compiler_version: 'v0.8.28+commit.7893614a',
			language: 'solidity',
			verified_at: '2026-07-16T09:30:43.020Z',
		}])

		const contracts = await contractsResolver.resolve.Caip2.resolve(network, context)
		expect(contracts).toEqual([{
			[EntityMetaKey.Selector]: contract,
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmContract, [], '$verification')]: {
					[EntityMetaKey.Selector]: {
						$contract: contract,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.EvmContractVerification, [], 'verifiedAtMs')]: Date.parse('2026-07-16T09:30:43.020Z'),
						[entityFieldAddressKey(EntityType.EvmContractVerification, [], '$compilation')]: {
							[EntityMetaKey.Selector]: {
								$contract: contract,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.EvmContractCompilation, [], 'language')]: 'solidity',
								[entityFieldAddressKey(EntityType.EvmContractCompilation, [], 'compilerVersion')]: 'v0.8.28+commit.7893614a',
							},
						},
					},
				},
			},
		}])
	})
})

describe('Blockscout EvmNetworkAccount_Timestamp', () => {
	const address = '0x1111111111111111111111111111111111111111'
	const tipTimestamp = '2024-01-02T03:04:05.000Z'
	const tipTimestampMs = Math.floor(Date.parse(tipTimestamp) / 1_000) * 1_000

	const accountTimestampsResolver = blockscoutRest.resolvers.find((candidate) => (
		candidate.entityType === EntityType.EvmNetworkAccount
		&& '$$timestamps' in candidate.projections
	))
	const accountTimestampResolver = blockscoutRest.resolvers.find((candidate) => (
		candidate.entityType === EntityType.EvmNetworkAccount_Timestamp
		&& 'isContract' in candidate.projections
		&& 'transactionCount' in candidate.projections
	))

	if (
		accountTimestampsResolver == null
		|| !('EvmNetworkEvmAccount' in accountTimestampsResolver.resolve)
		|| accountTimestampResolver == null
		|| !('AccountTimestampMsSource' in accountTimestampResolver.resolve)
	)
		throw new Error('Blockscout_Rest: missing EvmNetworkAccount timestamp resolvers')

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects tip account observations from counters + address details', async () => {
		getBlocks.mockResolvedValue([{
			height: 22_800_001,
		}])
		getBlockByNumber.mockResolvedValue({
			hash: txHash,
			height: 22_800_001,
			miner: {
				hash: address,
			},
			parent_hash: txHash,
			timestamp: tipTimestamp,
			transactions_count: 1,
		})
		getAddressCounters.mockResolvedValue({
			gas_usage_count: '0',
			token_transfers_count: '4',
			transactions_count: '12',
			validations_count: '0',
		})
		getAddressDetails.mockResolvedValue({
			is_contract: true,
		})

		const account = await accountTimestampsResolver.resolve.EvmNetworkEvmAccount.resolve({
			$actor: {
				address,
			},
			$network: network,
		}, context)
		expect(accountTimestampsResolver.projections.$$timestamps(account)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: {
					$network: network,
					$actor: {
						address,
					},
				},
				timestampMs: tipTimestampMs,
				source: Source.Blockscout_Rest,
			},
		}])

		const observation = await accountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: {
				$network: network,
				$actor: {
					address,
				},
			},
			timestampMs: tipTimestampMs,
			source: Source.Blockscout_Rest,
		}, context)
		expect(accountTimestampResolver.projections.blockNumber(observation)).toBe(22_800_001n)
		expect(accountTimestampResolver.projections.transactionCount(observation)).toBe(12n)
		expect(accountTimestampResolver.projections.tokenTransferCount(observation)).toBe(4)
		expect(accountTimestampResolver.projections.isContract(observation)).toBe(true)
	})

	it('fail-closes singular account observations on tip-clock mismatch', async () => {
		getBlocks.mockResolvedValue([{
			height: 22_800_001,
		}])
		getBlockByNumber.mockResolvedValue({
			hash: txHash,
			height: 22_800_001,
			miner: {
				hash: address,
			},
			parent_hash: txHash,
			timestamp: tipTimestamp,
			transactions_count: 1,
		})
		getAddressCounters.mockResolvedValue({
			gas_usage_count: '0',
			token_transfers_count: '0',
			transactions_count: '0',
			validations_count: '0',
		})
		getAddressDetails.mockResolvedValue({
			is_contract: false,
		})

		await expect(accountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: {
				$network: network,
				$actor: {
					address,
				},
			},
			timestampMs: tipTimestampMs + 1_000,
			source: Source.Blockscout_Rest,
		}, context)).rejects.toThrow('account observation timestamp does not match request')
	})
})

describe('Blockscout EvmTransaction enrolled leftovers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getTransactionLogs.mockResolvedValue([])
	})

	it('projects SetCode authorizations and resolves a native authorization route from the same source detail', async () => {
		const delegation = '0x5555555555555555555555555555555555555555'
		const authority = '0x6666666666666666666666666666666666666666'
		getTransactionByHash.mockResolvedValue({
			from: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			to: {
				hash: '0x2222222222222222222222222222222222222222',
			},
			gas_limit: '21000',
			gas_price: '1',
			gas_used: '21000',
			hash: txHash,
			nonce: 4,
			raw_input: '0x',
			value: '0',
			type: 4,
			status: 'ok',
			block_number: 12,
			position: 3,
			max_fee_per_gas: '2',
			max_priority_fee_per_gas: '1',
			created_contract: null,
			authorization_list: [{
				address_hash: delegation,
				authority,
				chain_id: 1,
				nonce: '7',
				r: '1',
				s: '2',
				v: 1,
				status: 'ok',
			}],
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'EvmNetworkTxHash' in candidate.resolve
			&& '$block' in candidate.projections
			&& 'SetCode' in candidate.projections
			&& '$$authorizations' in candidate.projections.SetCode
		))
		if (
			resolver == null
			|| !('EvmNetworkTxHash' in resolver.resolve)
		)
			throw new Error('Blockscout_Rest: missing EvmTransaction $block / SetCode projections')

		const entity = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)
		expect(resolver.projections.$block(entity)?.[EntityMetaKey.Selector]).toEqual({
			$network: network,
			blockNumber: 12n,
		})
		const authorizations = resolver.projections.SetCode.$$authorizations.select(entity)
		expect(authorizations).toHaveLength(1)
		expect(authorizations[0]?.[EntityMetaKey.Selector]).toEqual({
			$transaction: {
				$network: network,
				txHash,
			},
			authorizationIndex: 0,
		})
		expect(authorizations[0]?.delegationAddress).toBe(delegation)
		expect(authorizations[0]?.authority).toBe(authority)
		expect(authorizations[0]?.chainId).toBe(1n)
		expect(authorizations[0]?.nonce).toBe(7n)
		expect(authorizations[0]?.yParity).toBe(1)
		expect(authorizations[0]?.verificationStatus).toBe('ok')
		expect(authorizations[0]?.r).toBe(`0x${'0'.repeat(63)}1`)
		expect(authorizations[0]?.s).toBe(`0x${'0'.repeat(63)}2`)
		expect(authorizations[0]?.$authorityAccount?.[EntityMetaKey.Selector]).toEqual({
			$network: network,
			$actor: {
				address: authority,
			},
		})
		expect(authorizations[0]?.$delegationContract?.[EntityMetaKey.Selector]).toEqual({
			$network: network,
			address: delegation,
		})
		expect(resolver.projections.SetCode.$$authorizations.resolveCount(entity)).toBe(1)

		const authorizationResolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Eip7702Authorization
			&& 'TransactionAuthorizationIndex' in candidate.resolve
		))
		if (
			authorizationResolver == null
			|| !('TransactionAuthorizationIndex' in authorizationResolver.resolve)
		)
			throw new Error('Blockscout_Rest: missing Eip7702Authorization resolver')

		const authorization = await authorizationResolver.resolve.TransactionAuthorizationIndex.resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			authorizationIndex: 0,
		}, context)
		expect(authorizationResolver.projections.chainId(authorization)).toBe(1n)
		expect(authorizationResolver.projections.delegationAddress(authorization)).toBe(delegation)
		expect(authorizationResolver.projections.authority(authorization)).toBe(authority)
		expect(authorizationResolver.projections.nonce(authorization)).toBe(7n)
		expect(authorizationResolver.projections.yParity(authorization)).toBe(1)
		expect(authorizationResolver.projections.$authorityAccount(authorization)?.[EntityMetaKey.Selector]).toEqual({
			$network: network,
			$actor: {
				address: authority,
			},
		})
		expect(authorizationResolver.projections.$delegationContract(authorization)?.[EntityMetaKey.Selector]).toEqual({
			$network: network,
			address: delegation,
		})
		await expect(authorizationResolver.resolve.TransactionAuthorizationIndex.resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			authorizationIndex: 1,
		}, context)).rejects.toThrow('authorization index is missing from transaction')
	})

	it('fails closed when an authorization response does not preserve the requested transaction identity', async () => {
		getTransactionByHash.mockResolvedValue({
			from: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			to: {
				hash: '0x2222222222222222222222222222222222222222',
			},
			gas_limit: '21000',
			gas_price: '1',
			gas_used: '21000',
			hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			nonce: 4,
			raw_input: '0x',
			value: '0',
			type: 4,
			authorization_list: [],
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Eip7702Authorization
			&& 'TransactionAuthorizationIndex' in candidate.resolve
		))
		if (
			resolver == null
			|| !('TransactionAuthorizationIndex' in resolver.resolve)
		)
			throw new Error('Blockscout_Rest: missing Eip7702Authorization resolver')

		await expect(resolver.resolve.TransactionAuthorizationIndex.resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			authorizationIndex: 0,
		}, context)).rejects.toThrow('authorization transaction identity does not match request')
	})
})

describe('Blockscout EvmBlock / Blob enrolled leftovers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getTransactionLogs.mockResolvedValue([])
	})

	it('projects enrolled blobGasUsed / excessBlobGas on EvmBlock', async () => {
		getBlockByNumber.mockResolvedValue({
			hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			height: 12,
			miner: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			parent_hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			timestamp: '2024-01-02T03:04:05.000Z',
			transactions_count: 3,
			gas_used: '21000',
			gas_limit: '30000000',
			base_fee_per_gas: '7',
			blob_gas_used: '131072',
			excess_blob_gas: '0',
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmBlock
			&& 'EvmNetworkBlockNumber' in candidate.resolve
			&& 'blobGasUsed' in candidate.projections
			&& 'excessBlobGas' in candidate.projections
		))
		if (
			resolver == null
			|| !('EvmNetworkBlockNumber' in resolver.resolve)
		)
			throw new Error('Blockscout_Rest: missing EvmBlock blob gas projections')

		const entity = await resolver.resolve.EvmNetworkBlockNumber.resolve({
			$network: network,
			blockNumber: 12n,
		}, context)
		expect(resolver.projections.blobGasUsed(entity)).toBe(131072n)
		expect(resolver.projections.excessBlobGas(entity)).toBe(0n)
	})

	it('projects enrolled Blob.$$blobs from transaction detail', async () => {
		const versionedHash = '0x01aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		getTransactionByHash.mockResolvedValue({
			from: {
				hash: '0x1111111111111111111111111111111111111111',
			},
			to: {
				hash: '0x2222222222222222222222222222222222222222',
			},
			gas_limit: '21000',
			gas_price: '1',
			gas_used: '21000',
			hash: txHash,
			nonce: 4,
			raw_input: '0x',
			value: '0',
			type: 3,
			status: 'ok',
			block_number: 12,
			position: 3,
			max_fee_per_gas: '2',
			max_priority_fee_per_gas: '1',
			max_fee_per_blob_gas: '5',
			blob_gas_used: '131072',
			blob_versioned_hashes: [versionedHash, `0x00${'cd'.repeat(31)}`],
			created_contract: null,
			authorization_list: null,
		})
		const resolver = blockscoutRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'EvmNetworkTxHash' in candidate.resolve
			&& 'Blob' in candidate.projections
			&& '$$blobs' in candidate.projections.Blob
		))
		if (
			resolver == null
			|| !('EvmNetworkTxHash' in resolver.resolve)
		)
			throw new Error('Blockscout_Rest: missing EvmTransaction Blob.$$blobs projection')

		const entity = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		}, context)
		const blobs = resolver.projections.Blob.$$blobs.select(entity)
		expect(blobs).toHaveLength(1)
		expect(blobs[0]?.[EntityMetaKey.Selector]).toEqual({
			$transaction: {
				$network: network,
				txHash,
			},
			indexInTransaction: 0,
		})
		expect(blobs[0]?.versionedHash).toBe(versionedHash)
		expect(resolver.projections.Blob.$$blobs.resolveCount(entity)).toBe(1)
		expect(resolver.projections.Blob.blobGasUsed(entity)).toBe(131072n)
		expect(resolver.projections.Blob.maxFeePerBlobGas(entity)).toBe(5n)
	})
})
