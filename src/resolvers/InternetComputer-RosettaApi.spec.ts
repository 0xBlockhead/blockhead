import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	icpLedgerCanisterId,
} from '$/resolvers/InternetComputer-RosettaApi.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/InternetComputer/bindings.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const {
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getNetworkOptions,
	getNetworkStatus,
	searchTransactions,
} = vi.hoisted(() => ({
	getAccountBalance: vi.fn(),
	getAccountTransactions: vi.fn(),
	getBlock: vi.fn(),
	getNetworkOptions: vi.fn(),
	getNetworkStatus: vi.fn(),
	searchTransactions: vi.fn(),
}))

vi.mock('$/sources/InternetComputer/RosettaApi/queries.ts', () => ({
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getNetworkOptions,
	getNetworkStatus,
	searchTransactions,
}))

const { default: internetComputerRosettaResolvers } = await import('$/resolvers/InternetComputer-RosettaApi.ts')

const networkLedgerCanistersResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpNetwork
	&& '$$ledgerCanisters' in resolver.projections
))
const ledgerIdentityResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerCanister
	&& 'ledgerStandard' in resolver.projections
))
const ledgerTimestampsResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerCanister
	&& '$$timestamps' in resolver.projections
))
const accountTimestampsResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerCanister
	&& '$$accountTimestamps' in resolver.projections
))
const blocksResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerCanister
	&& '$$blocks' in resolver.projections
))
const transactionsResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerCanister
	&& '$$transactions' in resolver.projections
))
const singularBlockResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerBlock
	&& 'blockHash' in resolver.projections
))
const singularTransactionResolver = internetComputerRosettaResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.IcpLedgerTransaction
))

if (
	networkLedgerCanistersResolver == null
	|| ledgerIdentityResolver == null
	|| ledgerTimestampsResolver == null
	|| accountTimestampsResolver == null
	|| blocksResolver == null
	|| transactionsResolver == null
	|| singularBlockResolver == null
	|| singularTransactionResolver == null
)
	throw new Error('InternetComputer-RosettaApi spec missing deepened resolvers')

const binding = bindings[Source.InternetComputer_RosettaApi][0]

const network = {
	$network: {
		slug: networkBySlug.icp.slug,
	},
}
const ledger = {
	$canister: {
		$network: network,
		canisterId: icpLedgerCanisterId,
	},
}
const accountIdentifier = 'a'.repeat(64)
const blockHash = 'c'.repeat(64)
const parentHash = 'd'.repeat(64)
const transactionHash = 'e'.repeat(64)

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const blockWire = {
	block_identifier: {
		index: 100,
		hash: blockHash,
	},
	parent_block_identifier: {
		index: 99,
		hash: parentHash,
	},
	timestamp: 1_720_000_000_000,
	transactions: [{
		transaction_identifier: {
			hash: transactionHash,
		},
		operations: [
			{
				operation_identifier: {
					index: 0,
				},
				type: 'TRANSACTION',
				account: {
					address: 'b'.repeat(64),
				},
				amount: {
					value: '-50',
					currency: {
						symbol: 'ICP',
						decimals: 8,
					},
				},
			},
			{
				operation_identifier: {
					index: 1,
				},
				type: 'TRANSACTION',
				account: {
					address: accountIdentifier,
				},
				amount: {
					value: '50',
					currency: {
						symbol: 'ICP',
						decimals: 8,
					},
				},
			},
			{
				operation_identifier: {
					index: 2,
				},
				type: 'FEE',
				account: {
					address: 'b'.repeat(64),
				},
				amount: {
					value: '-10000',
					currency: {
						symbol: 'ICP',
						decimals: 8,
					},
				},
			},
		],
		metadata: {
			memo: 7,
			created_at_time: 1_720_000_000_000_000_000,
		},
	}],
}

describe('Internet Computer Rosetta ledger resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(Date, 'now').mockReturnValue(1_720_000_000_000)
	})

	it('declares canonical ICP Rosetta binding and ledger applicability', () => {
		expect(binding).toEqual(expect.objectContaining({
			source: Source.InternetComputer_RosettaApi,
			target: {
				kind: SourceTargetKind.NetworkSlug,
				key: 'icp',
			},
			endpoints: [{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:IC_ROSETTA_URL',
				corsEnabled: false,
			}],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.RosettaApi,
			operationGroups: [SourceOperationGroup.GenericRead],
			delivery: SourceDelivery.RemoteQuery,
			credentials: [],
		}))
		expect(internetComputerRosettaResolvers.source).toBe(Source.InternetComputer_RosettaApi)
		expect(ledgerTimestampsResolver.resolve.Canister.appliesTo).toEqual([{
			$canister: {
				$network: {
					$network: {
						slug: networkBySlug.icp.slug,
					},
				},
				canisterId: icpLedgerCanisterId,
			},
		}])
	})

	it('projects the enrolled ICP ledger canister under IcpNetwork', async () => {
		const ledgerCanisters = await networkLedgerCanistersResolver.resolve.Network.resolve(network, resolverContext)
		const projection = networkLedgerCanistersResolver.projections.$$ledgerCanisters
		if (typeof projection !== 'function')
			throw new Error('missing ledger canisters projection')

		expect(projection(ledgerCanisters, network, resolverContext)).toEqual([{
			[EntityMetaKey.Selector]: ledger,
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.IcpLedgerCanister, [], 'ledgerStandard')]: 'icp',
			},
		}])
	})

	it('projects ledger tip observations from network status and options', async () => {
		getNetworkStatus.mockResolvedValueOnce({
			current_block_identifier: {
				index: 9_890_652,
				hash: blockHash,
			},
			current_block_timestamp: 1_720_000_000_000,
			genesis_block_identifier: {
				index: 0,
				hash: parentHash,
			},
		})
		getNetworkOptions.mockResolvedValueOnce({
			allow: {
				operation_statuses: [{
					status: 'COMPLETED',
					successful: true,
				}],
				operation_types: ['TRANSACTION', 'FEE', 'APPROVE'],
			},
		})

		const timestamps = await ledgerTimestampsResolver.resolve.Canister.resolve(ledger, resolverContext)
		const projection = ledgerTimestampsResolver.projections.$$timestamps
		if (typeof projection !== 'function')
			throw new Error('missing ledger timestamps projection')
		const [observation] = projection(timestamps, ledger, resolverContext)

		expect(observation[EntityMetaKey.Selector]).toEqual({
			$ledger: ledger,
			timestampMs: 1_720_000_000_000,
			source: Source.InternetComputer_RosettaApi,
		})
		expect(observation[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'symbol')]: 'ICP',
			[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'name')]: 'Internet Computer',
			[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'decimals')]: 8,
			[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'latestBlockIndex')]: 9_890_652n,
			[entityFieldAddressKey(EntityType.IcpLedgerCanister_Timestamp, [], 'supportedStandards')]: ['icrc-1', 'icrc-2'],
		})
	})

	it('projects owner-filtered account balance observations and skips unscoped lists', async () => {
		const empty = await accountTimestampsResolver.resolve.Canister.resolve(ledger, resolverContext)
		expect(empty).toEqual([])
		expect(getAccountBalance).not.toHaveBeenCalled()

		getAccountBalance.mockResolvedValueOnce({
			block_identifier: {
				index: 100,
				hash: blockHash,
			},
			balances: [{
				value: '18446744073709551615',
				currency: {
					symbol: 'ICP',
					decimals: 8,
				},
			}],
		})
		const timestamps = await accountTimestampsResolver.resolve.Canister.resolve(ledger, {
			...resolverContext,
			filters: [{
				fieldPath: ['owner'],
				operator: 'eq',
				value: accountIdentifier,
			}],
		})
		const projection = accountTimestampsResolver.projections.$$accountTimestamps
		if (typeof projection !== 'function')
			throw new Error('missing account timestamps projection')
		const [observation] = projection(timestamps, ledger, resolverContext)

		expect(getAccountBalance).toHaveBeenCalledWith(binding, accountIdentifier)
		expect(observation[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.IcpLedgerAccount_Timestamp, [], 'balance')]: 18446744073709551615n,
		})
	})

	it('projects tip ledger blocks and singular block fields', async () => {
		getNetworkStatus.mockResolvedValueOnce({
			current_block_identifier: {
				index: 100,
				hash: blockHash,
			},
			current_block_timestamp: 1_720_000_000_000,
			genesis_block_identifier: {
				index: 0,
				hash: parentHash,
			},
		})
		getBlock.mockResolvedValueOnce({
			block: blockWire,
		})
		getBlock.mockResolvedValueOnce({
			block: {
				...blockWire,
				block_identifier: {
					index: 99,
					hash: parentHash,
				},
				parent_block_identifier: {
					index: 98,
					hash: 'f'.repeat(64),
				},
			},
		})

		const page = await blocksResolver.resolve.Canister.resolve(ledger, resolverContext)
		const blocksProjection = blocksResolver.projections.$$blocks
		if (typeof blocksProjection === 'function' || blocksProjection.select == null)
			throw new Error('missing blocks projection')
		const blocks = blocksProjection.select(page, ledger, resolverContext)

		expect(blocks[0]?.[EntityMetaKey.Selector]).toEqual({
			$ledger: ledger,
			blockIndex: 100n,
		})
		expect(blocks[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'blockHash')]: blockHash,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'parentHash')]: parentHash,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'timestampNs')]: 1_720_000_000_000_000_000n,
			[entityFieldAddressKey(EntityType.IcpLedgerBlock, [], 'transactionCount')]: 1,
		})

		getBlock.mockResolvedValueOnce({
			block: blockWire,
		})
		const singular = await singularBlockResolver.resolve.LedgerBlockIndex.resolve({
			$ledger: ledger,
			blockIndex: 100n,
		}, resolverContext)
		expect(singularBlockResolver.projections.blockHash(singular, {
			$ledger: ledger,
			blockIndex: 100n,
		}, resolverContext)).toBe(blockHash)
	})

	it('projects ledger transactions from search and singular block transactions', async () => {
		searchTransactions.mockResolvedValueOnce({
			transactions: [{
				block_identifier: blockWire.block_identifier,
				transaction: blockWire.transactions[0],
			}],
			total_count: 1,
			next_offset: 1,
		})

		const page = await transactionsResolver.resolve.Canister.resolve(ledger, resolverContext)
		const transactionsProjection = transactionsResolver.projections.$$transactions
		if (typeof transactionsProjection === 'function' || transactionsProjection.select == null)
			throw new Error('missing transactions projection')
		const [transaction] = transactionsProjection.select(page, ledger, resolverContext)

		expect(searchTransactions).toHaveBeenCalled()
		expect(transaction?.[EntityMetaKey.Selector]).toEqual({
			$block: {
				$ledger: ledger,
				blockIndex: 100n,
			},
			transactionIndex: 0,
		})
		expect(transaction?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'transactionHash')]: transactionHash,
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'fromAccount')]: 'b'.repeat(64),
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'toAccount')]: accountIdentifier,
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'amount')]: 50n,
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'fee')]: 10000n,
			[entityFieldAddressKey(EntityType.IcpLedgerTransaction, [], 'memo')]: 7n,
		})

		getAccountTransactions.mockResolvedValueOnce({
			transactions: [],
			total_count: 0,
		})
		await transactionsResolver.resolve.Canister.resolve(ledger, {
			...resolverContext,
			filters: [{
				fieldPath: ['owner'],
				operator: 'eq',
				value: accountIdentifier,
			}],
		})
		expect(getAccountTransactions).toHaveBeenCalledWith(binding, expect.objectContaining({
			accountIdentifier,
		}))

		getBlock.mockResolvedValueOnce({
			block: blockWire,
		})
		const singular = await singularTransactionResolver.resolve.BlockTransactionIndex.resolve({
			$block: {
				$ledger: ledger,
				blockIndex: 100n,
			},
			transactionIndex: 0,
		}, resolverContext)
		expect(singularTransactionResolver.projections.amount?.(singular, {
			$block: {
				$ledger: ledger,
				blockIndex: 100n,
			},
			transactionIndex: 0,
		}, resolverContext)).toBe(50n)
	})

	it('rejects non-ICP ledger canisters', async () => {
		await expect(ledgerIdentityResolver.resolve.Canister.resolve({
			$canister: {
				$network: network,
				canisterId: 'aaaaa-aa',
			},
		}, resolverContext)).rejects.toThrow('unsupported ICP ledger canister')
	})
})
