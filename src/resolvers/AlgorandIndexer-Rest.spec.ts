import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAccount,
	getAccountApplications,
	getAccountAssets,
	getApplicationAccounts,
	getApplication,
	getAsset,
	getAssetBalances,
	getBlock,
	getBlockHash,
	getHealth,
	getStatus,
	getTransaction,
	getTransactionProof,
	listApplicationBoxes,
	listTransactions,
} = vi.hoisted(() => ({
	getAccount: vi.fn(),
	getAccountApplications: vi.fn(),
	getAccountAssets: vi.fn(),
	getApplicationAccounts: vi.fn(),
	getApplication: vi.fn(),
	getAsset: vi.fn(),
	getAssetBalances: vi.fn(),
	getBlock: vi.fn(),
	getBlockHash: vi.fn(),
	getHealth: vi.fn(),
	getStatus: vi.fn(),
	getTransaction: vi.fn(),
	getTransactionProof: vi.fn(),
	listApplicationBoxes: vi.fn(),
	listTransactions: vi.fn(),
}))

vi.mock('$/sources/AlgorandIndexer/Rest/queries.ts', () => ({
	getAccount,
	getAccountApplications,
	getAccountAssets,
	getApplicationAccounts,
	getApplication,
	getAsset,
	getAssetBalances,
	getBlock,
	getHealth,
	getTransaction,
	listApplicationBoxes,
	listTransactions,
}))

vi.mock('$/sources/Algod/Rest/queries.ts', () => ({
	getBlockHash,
	getStatus,
	getTransactionProof,
}))

const { default: algorandIndexerResolvers } = await import('$/resolvers/AlgorandIndexer-Rest.ts')

const holdingsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$assetHoldingRounds' in resolver.projections
))
const observationsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandAccount
	&& '$$timestamps' in resolver.projections
))
const localStateResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$applicationLocalStateRounds' in resolver.projections
))
const assetResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandAsset
	&& 'creator' in resolver.projections
))
const assetHoldingsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$holdingRounds' in resolver.projections
))
const applicationResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandApplication
	&& 'creator' in resolver.projections
))
const boxesResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$boxes' in resolver.projections
))
const applicationLocalStatesResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	'$$localStateRounds' in resolver.projections
))
const transactionResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandTransaction
	&& 'sender' in resolver.projections
))
const transactionProofsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandTransaction
	&& '$$proofs' in resolver.projections
))
const transactionProofResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandTransactionProof
))
const roundResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandRound
))
const networkTimestampsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandNetwork
	&& '$$timestamps' in resolver.projections
))
const networkTransactionsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandNetwork
	&& '$$transactions' in resolver.projections
))
const transactionGroupResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandTransactionGroup
	&& '$$transactions' in resolver.projections
))
const networkRoundsResolver = algorandIndexerResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AlgorandNetwork
	&& '$$rounds' in resolver.projections
))

if (
	holdingsResolver == null
	|| observationsResolver == null
	|| localStateResolver == null
	|| assetResolver == null
	|| assetHoldingsResolver == null
	|| applicationResolver == null
	|| boxesResolver == null
	|| applicationLocalStatesResolver == null
	|| transactionResolver == null
	|| transactionProofsResolver == null
	|| transactionProofResolver == null
	|| roundResolver == null
	|| networkTimestampsResolver == null
	|| networkTransactionsResolver == null
	|| transactionGroupResolver == null
	|| networkRoundsResolver == null
)
	throw new Error('AlgorandIndexer-Rest spec missing deepened resolvers')

const network = {
	$network: {
		slug: networkBySlug.algorand.slug,
	},
}
const account = {
	$network: network,
	address: 'A'.repeat(58),
}
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
	providerContinuationToken: 'opaque-current',
}

describe('Algorand Indexer deepened resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('declares the architecture-neutral Algorand selector applicability', () => {
		expect(holdingsResolver.resolve[
			'NetworkAddress'
		].appliesTo).toEqual([{
			$network: {
				$network: {
					slug: networkBySlug.algorand.slug,
				},
			},
		}])
		expect(algorandIndexerResolvers.source).toBe(Source.Nodely)
	})

	it('resolves paginated transaction group members through the native group hierarchy', async () => {
		const group = {
			$network: network,
			group: `0x${'00'.repeat(32)}`,
		}
		listTransactions.mockResolvedValueOnce({
			'current-round': 100,
			'next-token': 'next-group-page',
			transactions: [{
				id: 'grouped-tx',
				sender: account.address,
				fee: 1000,
				group: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
				'tx-type': 'pay',
			}],
		})

		const page = await transactionGroupResolver.resolve.NetworkGroup.resolve(group, resolverContext)
		expect(listTransactions).toHaveBeenCalledWith({
			groupId: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
			limit: 2,
			next: 'opaque-current',
		})
		const projection = transactionGroupResolver.projections.$$transactions
		if (typeof projection === 'function' || projection.select == null || projection.continuation == null)
			throw new Error('missing transaction group projection')
		expect(projection.select(page, group, resolverContext)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				txId: 'grouped-tx',
			},
		})
		expect(projection.continuation(page, group, resolverContext)).toEqual({
			operation: 'transaction-group-transactions',
			target: group.group,
			terminal: false,
			token: 'next-group-page',
		})
	})

	it('materializes paginated asset holding observations with exact identity and provenance', async () => {
		getAccountAssets.mockResolvedValueOnce({
			assets: [{
				amount: 123,
				'asset-id': 42,
				deleted: false,
				'is-frozen': true,
				'opted-in-at-round': 80,
			}, {
				amount: 7,
				'asset-id': 8,
				'is-frozen': false,
			}],
			'current-round': 100,
			'next-token': 'opaque-next',
		})

		const page = await holdingsResolver.resolve[
			'NetworkAddress'
		].resolve(account, resolverContext)
		const projection = holdingsResolver.projections.$$assetHoldingRounds
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('AlgorandIndexer-Rest spec missing holding pagination')

		const holdings = projection.select(page, account, resolverContext)
		const [holding] = holdings
		expect(getAccountAssets).toHaveBeenCalledWith({
			address: account.address,
			limit: 2,
			next: 'opaque-current',
		})
		expect(holding[EntityMetaKey.Selector]).toEqual({
			$account: account,
			$asset: {
				$network: network,
				assetId: 42n,
			},
			round: 100n,
			source: Source.Nodely,
		})
		expect(holding[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'amount')]: 123n,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'frozen')]: true,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'optedInAtRound')]: 80n,
			[entityFieldAddressKey(EntityType.AlgorandAssetHolding_Round, [], 'deleted')]: false,
		})
		expect(holdings.map((item) => item[EntityMetaKey.Selector].$asset.assetId)).toEqual([
			42n,
			8n,
		])
		expect(projection.continuation(page, account, resolverContext)).toEqual({
			operation: 'account-asset-holdings',
			target: account.address,
			terminal: false,
			token: 'opaque-next',
		})
	})

	it('materializes the current account observation and avoids a zero-limit request', async () => {
		getAccount.mockResolvedValueOnce({
			account: {
				address: account.address,
				amount: 9_000_000,
				'pending-rewards': 2,
				'reward-base': 3,
				status: 'Online',
			},
			'current-round': 100,
		})

		const observations = await observationsResolver.resolve[
			'NetworkAddress'
		].resolve(account, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const projection = observationsResolver.projections.$$timestamps
		if (typeof projection !== 'function')
			throw new Error('AlgorandIndexer-Rest spec missing observation projection')
		const [observation] = projection(observations, account, resolverContext)
		expect(observation[EntityMetaKey.Selector]).toEqual({
			$account: account,
			round: 100n,
			source: Source.Nodely,
		})
		expect(observation[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'amount')]: 9_000_000n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'pendingRewards')]: 2n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'rewardsBase')]: 3n,
			[entityFieldAddressKey(EntityType.AlgorandAccount_Timestamp, [], 'status')]: 'Online',
		})

		await observationsResolver.resolve[
			'NetworkAddress'
		].resolve(account, {
			...resolverContext,
			pagination: {
				limit: 0,
			},
		})
		expect(getAccount).toHaveBeenCalledTimes(1)
	})

	it('projects asset creator/observation, application state, round tip, and network lists', async () => {
		getAsset.mockResolvedValueOnce({
			asset: {
				index: 5,
				deleted: false,
				params: {
					creator: account.address,
					decimals: 0,
					total: 10_000,
					'unit-name': 'TEST',
					name: 'Test',
					url: 'https://example.com',
				},
			},
			'current-round': 50,
		})
		const assetSnapshot = await assetResolver.resolve.NetworkAssetId.resolve({
			$network: network,
			assetId: 5n,
		}, resolverContext)
		expect(assetResolver.projections.creator(assetSnapshot)).toBe(account.address)
		expect(assetResolver.projections.$$timestamps(assetSnapshot)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'total')]: 10_000n,
			[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'decimals')]: 0,
			[entityFieldAddressKey(EntityType.AlgorandAsset_Timestamp, [], 'unitName')]: 'TEST',
		})

		getApplication.mockResolvedValueOnce({
			application: {
				id: 9,
				deleted: false,
				params: {
					creator: account.address,
					'global-state': [{
						key: 'x',
					}],
					'global-state-schema': {
						'num-uint': 1,
					},
				},
			},
			'current-round': 51,
		})
		const applicationSnapshot = await applicationResolver.resolve.NetworkApplicationId.resolve({
			$network: network,
			applicationId: 9n,
		}, resolverContext)
		expect(applicationResolver.projections.creator(applicationSnapshot)).toBe(account.address)
		expect(applicationResolver.projections.$$timestamps(applicationSnapshot)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AlgorandApplication_Timestamp, [], 'globalState')]: [{
				key: 'x',
			}],
		})

		getTransaction.mockResolvedValueOnce({
			'current-round': 52,
			transaction: {
				id: 'TX',
				sender: account.address,
				fee: 1000,
				'tx-type': 'pay',
				'confirmed-round': 40,
			},
		})
		const transactionSnapshot = await transactionResolver.resolve.NetworkTxId.resolve({
			$network: network,
			txId: 'TX',
		}, resolverContext)
		expect(transactionResolver.projections.sender(transactionSnapshot)).toBe(account.address)
		expect(transactionResolver.projections.transactionType(transactionSnapshot)).toBe('pay')
		expect(transactionResolver.projections.round(transactionSnapshot)).toBe(40n)

		getBlock.mockResolvedValueOnce({
			round: 40,
			timestamp: 1_700_000_000,
			'genesis-hash': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
			proposer: account.address,
		})
		getBlockHash.mockResolvedValueOnce({
			blockHash: '5ZWEXQT2PGYESRO5TNMWSHMPPP63Z6ZLODAVGZ66C7OEE5FOVVPA',
		})
		const roundSnapshot = await roundResolver.resolve.NetworkRound.resolve({
			$network: network,
			round: 40n,
		}, resolverContext)
		expect(roundResolver.projections.timestampMs(roundSnapshot)).toBe(1_700_000_000_000)
		expect(roundResolver.projections.proposer(roundSnapshot)).toBe(account.address)
		expect(roundResolver.projections.genesisHash(roundSnapshot)).toMatch(/^0x/)
		expect(roundResolver.projections.hash(roundSnapshot)).toBe(
			'0xee6c4bc27a79b04945dd9b59691d8f7bfdbcfb2b70c15367de17dc4274aead5e'
		)
		expect(getBlockHash).toHaveBeenCalledWith(40n)

		getTransaction.mockResolvedValueOnce({
			'current-round': 52,
			transaction: {
				id: 'TXPROOF1ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN',
				sender: account.address,
				fee: 1000,
				'tx-type': 'pay',
				'confirmed-round': 40,
			},
		})
		getTransactionProof.mockResolvedValueOnce({
			hashtype: 'sha512_256',
			idx: 0,
			proof: 'vwCgYDrrRWbU76XEUqd8ewEvZrcRroSn96Ss+rHnVFpZyGSisR944QB1wvQpj+8u+Bhs9T1tnzWUTgMpeeHQn08Ncqo0ylkFmhuSHmFLx+mfcFZnkeHfXOu18cQRSWvK',
			stibhash: 'JKa8pryIvuAe+9B7+755U2Epv4F9umLZ5Quy5aXp0bI=',
			treedepth: 3,
		})
		const proofs = await transactionProofsResolver.resolve.NetworkTxId.resolve({
			$network: network,
			txId: 'TXPROOF1ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN',
		}, resolverContext)
		expect(transactionProofsResolver.projections.$$proofs(proofs)).toEqual([
			expect.objectContaining({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: network,
						txId: 'TXPROOF1ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN',
					},
					round: 40n,
					hashType: 'sha512_256',
					source: Source.Nodely,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.AlgorandTransactionProof, [], 'treeDepth')]: 3,
					[entityFieldAddressKey(EntityType.AlgorandTransactionProof, [], 'stibHash')]: expect.stringMatching(/^0x/),
				}),
			}),
		])

		getHealth.mockResolvedValueOnce({
			round: 100,
		})
		getStatus.mockResolvedValueOnce({
			'last-round': 100,
			'last-version': 'https://github.com/algorandfoundation/specs/tree/example',
			'next-version': 'https://github.com/algorandfoundation/specs/tree/example',
			'next-version-round': 101,
			'next-version-supported': true,
			'stopped-at-unsupported-round': false,
			'catchup-time': 0,
			'time-since-last-round': 0,
			catchpoint: '12345#ABCD',
		})
		getBlock.mockResolvedValueOnce({
			round: 100,
			timestamp: 1_700_000_100,
			'genesis-hash': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
		})
		const networkTimestamps = await networkTimestampsResolver.resolve.Network.resolve(network, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const networkTimestampProjection = networkTimestampsResolver.projections.$$timestamps
		if (typeof networkTimestampProjection !== 'function')
			throw new Error('missing network timestamp projection')
		expect(networkTimestampProjection(networkTimestamps, network, resolverContext)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'latestRound')]: 100n,
			[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'catchpoint')]: '12345#ABCD',
			[entityFieldAddressKey(EntityType.AlgorandNetwork_Timestamp, [], 'protocolVersion')]: (
				'https://github.com/algorandfoundation/specs/tree/example'
			),
		})

		listTransactions.mockResolvedValueOnce({
			'current-round': 100,
			'next-token': 'more',
			transactions: [{
				id: 'N1',
				sender: account.address,
				fee: 1000,
				'tx-type': 'pay',
				'confirmed-round': 99,
			}],
		})
		const networkTxPage = await networkTransactionsResolver.resolve.Network.resolve(network, resolverContext)
		const networkTxProjection = networkTransactionsResolver.projections.$$transactions
		if (typeof networkTxProjection === 'function' || networkTxProjection.select == null)
			throw new Error('missing network tx projection')
		expect(networkTxProjection.select(networkTxPage, network, resolverContext)[0][EntityMetaKey.Selector]).toEqual({
			$network: network,
			txId: 'N1',
		})

		getAccountApplications.mockResolvedValueOnce({
			'apps-local-states': [{
				id: 9,
				deleted: false,
				'key-value': [{
					key: 'a',
				}],
			}],
			'current-round': 100,
		})
		const localStatePage = await localStateResolver.resolve.NetworkAddress.resolve(account, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const localStateProjection = localStateResolver.projections.$$applicationLocalStateRounds
		if (typeof localStateProjection === 'function' || localStateProjection.select == null)
			throw new Error('missing local state projection')
		expect(localStateProjection.select(localStatePage, account, resolverContext)[0][EntityMetaKey.Selector]).toEqual({
			$account: account,
			$application: {
				$network: network,
				applicationId: 9n,
			},
			round: 100n,
			source: Source.Nodely,
		})

		listApplicationBoxes.mockResolvedValueOnce({
			'application-id': 9,
			boxes: [{
				name: 'Ym94',
			}],
		})
		const boxesPage = await boxesResolver.resolve.NetworkApplicationId.resolve({
			$network: network,
			applicationId: 9n,
		}, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const boxesProjection = boxesResolver.projections.$$boxes
		if (typeof boxesProjection === 'function' || boxesProjection.select == null)
			throw new Error('missing boxes projection')
		expect(boxesProjection.select(boxesPage, {
			$network: network,
			applicationId: 9n,
		}, resolverContext)[0][EntityMetaKey.Selector].boxName).toMatch(/^0x/)

		getApplicationAccounts.mockResolvedValueOnce({
			accounts: [{
				address: account.address,
				'apps-local-state': [{
					id: 9,
					deleted: false,
					'key-value': [{
						key: 'a',
					}],
				}],
			}],
			'current-round': 101,
			'next-token': 'account-next',
		})
		const applicationLocalStatesPage = await applicationLocalStatesResolver.resolve.NetworkApplicationId.resolve({
			$network: network,
			applicationId: 9n,
		}, resolverContext)
		const applicationLocalStatesProjection = applicationLocalStatesResolver.projections.$$localStateRounds
		if (
			typeof applicationLocalStatesProjection === 'function'
			|| applicationLocalStatesProjection.select == null
			|| applicationLocalStatesProjection.continuation == null
		)
			throw new Error('missing application local state projection')
		expect(getApplicationAccounts).toHaveBeenCalledWith({
			applicationId: 9n,
			limit: 2,
			next: 'opaque-current',
		})
		expect(applicationLocalStatesProjection.select(applicationLocalStatesPage, {
			$network: network,
			applicationId: 9n,
		}, resolverContext)[0]).toEqual(expect.objectContaining({
			[EntityMetaKey.Selector]: {
				$account: account,
				$application: {
					$network: network,
					applicationId: 9n,
				},
				round: 101n,
				source: Source.Nodely,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.AlgorandApplicationLocalState_Round, [], 'keyValues')]: [{
					key: 'a',
				}],
			}),
		}))
		expect(applicationLocalStatesProjection.continuation(applicationLocalStatesPage, {
			$network: network,
			applicationId: 9n,
		}, resolverContext)).toEqual({
			operation: 'application-local-state-rounds',
			target: '9',
			terminal: false,
			token: 'account-next',
		})

		getAssetBalances.mockResolvedValueOnce({
			balances: [{
				address: account.address,
				amount: 1,
				'is-frozen': false,
			}],
			'current-round': 100,
		})
		const assetBalancesPage = await assetHoldingsResolver.resolve.NetworkAssetId.resolve({
			$network: network,
			assetId: 5n,
		}, {
			...resolverContext,
			providerContinuationToken: undefined,
		})
		const assetHoldingsProjection = assetHoldingsResolver.projections.$$holdingRounds
		if (typeof assetHoldingsProjection === 'function' || assetHoldingsProjection.select == null)
			throw new Error('missing asset holdings projection')
		expect(assetHoldingsProjection.select(assetBalancesPage, {
			$network: network,
			assetId: 5n,
		}, resolverContext)[0][EntityMetaKey.Selector].$account.address).toBe(account.address)

		getHealth.mockResolvedValueOnce({
			round: 5,
		})
		const roundsPage = await networkRoundsResolver.resolve.Network.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 3,
			},
			providerContinuationToken: undefined,
		})
		const roundsProjection = networkRoundsResolver.projections.$$rounds
		if (typeof roundsProjection === 'function' || roundsProjection.select == null)
			throw new Error('missing rounds projection')
		expect(roundsProjection.select(roundsPage, network, resolverContext).map((row) => row[EntityMetaKey.Selector].round)).toEqual([
			5n,
			4n,
			3n,
		])
	})

	it('rejects a foreign network before invoking provider transport', async () => {
		await expect(holdingsResolver.resolve[
			'NetworkAddress'
		].resolve({
			$network: {
				$network: {
					slug: 'not-algorand',
				},
			},
			address: account.address,
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAccountAssets).not.toHaveBeenCalled()
	})
})
