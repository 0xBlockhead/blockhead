import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getLatestBlock = vi.hoisted(() => vi.fn())
const getNetworkState = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const getTransaction = vi.hoisted(() => vi.fn())
const getAsset = vi.hoisted(() => vi.fn())
const getPool = vi.hoisted(() => vi.fn())
const getPoolStats = vi.hoisted(() => vi.fn())
const listPools = vi.hoisted(() => vi.fn())
const getRewardAccount = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Cardanoscan/Rest/queries.ts', () => ({
	restEndpoints: [{
		url: 'https://api.cardanoscan.io',
		transportType: 'Http',
		providerName: 'Cardanoscan',
	}],
	getLatestBlock,
	getNetworkState,
	getBlock,
	getTransaction,
	getAsset,
	getPool,
	getPoolStats,
	listPools,
	getRewardAccount,
}))

const { default: cardanoscan } = await import('$/resolvers/Cardanoscan-Rest.ts')

const networkTipResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$timestamps' in resolver.projections.Cardano
))
const networkBlocksResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$blocks' in resolver.projections.Cardano
))
const networkPoolsResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$stakePools' in resolver.projections.Cardano
))
const blockResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoBlock
))
const transactionResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoTransaction
))
const assetResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoNativeAsset
))
const networkTimestampResolver = cardanoscan.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoNetwork_Timestamp
))

if (
	networkTipResolver == null
	|| networkBlocksResolver == null
	|| networkPoolsResolver == null
	|| blockResolver == null
	|| transactionResolver == null
	|| assetResolver == null
	|| networkTimestampResolver == null
)
	throw new Error('Cardanoscan-Rest spec missing resolvers')

const network = {
	slug: 'cardano',
}

const context = {
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

const tipBlock = {
	hash: 'A'.repeat(64),
	previousBlockHash: 'B'.repeat(64),
	blockHeight: 12_345_678,
	totalFees: '1000',
	slot: 432_000,
	epoch: 500,
	absSlot: 130_000_102,
	timestamp: '2026-07-31T19:32:02.172Z',
	txCount: 7,
	assetTxCount: 1,
	totalOutput: '5000000',
	slotLeader: 'pool1example',
	bodySize: 80_000,
	vrfVKey: 'vrf_vk1example',
}

const tipTimestampMs = Date.parse(tipBlock.timestamp)

describe('Cardanoscan Rest Cardano projections', () => {
	it('projects tip timestamps / tip block / stake pool page', async () => {
		getLatestBlock.mockResolvedValue(tipBlock)
		getNetworkState.mockResolvedValue({
			circulatingSupply: '35000000000000000',
			reserves: '1000',
			treasury: '2000',
			liveCirculatingSupply: '35000000000000000',
		})
		listPools.mockResolvedValue({
			pageNo: 1,
			limit: 2,
			count: 2,
			pools: [
				{
					poolId: 'pool1aaa',
					status: true,
					ticker: 'AAA',
					name: 'Alpha',
				},
				{
					poolId: 'pool1bbb',
					status: false,
					ticker: 'BBB',
				},
			],
		})

		const tipSnapshot = await networkTipResolver.resolve.Slug.resolve(network)
		expect(networkTipResolver.projections.Cardano.$$timestamps(tipSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: tipTimestampMs,
				source: Source.Cardanoscan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: 130_000_102n,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: 12_345_678n,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: tipTimestampMs,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: 7,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: 500,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'circulatingSupplyLovelace')]: 35_000_000_000_000_000n,
			},
		}])

		const blocksSnapshot = await networkBlocksResolver.resolve.Slug.resolve(network, context)
		expect(networkBlocksResolver.projections.Cardano.$$blocks(blocksSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				hash: 'a'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: 130_000_102n,
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: 12_345_678n,
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: 500,
			},
		}])

		const poolsSnapshot = await networkPoolsResolver.resolve.Slug.resolve(network, context)
		expect(networkPoolsResolver.projections.Cardano.$$stakePools.select(poolsSnapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					poolId: 'pool1aaa',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'name')]: 'Alpha',
					[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: 'AAA',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					poolId: 'pool1bbb',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: 'BBB',
				},
			},
		])
	})

	it('resolves singular block / transaction / asset leftovers', async () => {
		getBlock.mockResolvedValue(tipBlock)
		getTransaction.mockResolvedValue({
			hash: 'C'.repeat(64),
			blockHash: 'A'.repeat(64),
			fees: '170000',
			slot: 432_000,
			epoch: 500,
			blockHeight: 12_345_678,
			absSlot: 130_000_102,
			timestamp: tipBlock.timestamp,
			index: 0,
			status: true,
			ttl: {
				timestamp: tipBlock.timestamp,
				slot: 130_000_200,
			},
			mint: [{
				policyId: 'd'.repeat(56),
				assetName: 'cafe',
				fingerprint: 'asset1mint',
				assetId: `${'d'.repeat(56)}cafe`,
				value: '5',
			}],
			metadata: {
				label: 721,
			},
		})
		getLatestBlock.mockResolvedValue(tipBlock)
		getAsset.mockResolvedValue({
			policyId: 'E'.repeat(56),
			assetName: 'AbCd',
			fingerprint: 'asset1example',
			assetId: `${'E'.repeat(56)}AbCd`,
			totalSupply: '1000',
			txCount: 3,
			mintedOn: tipBlock.timestamp,
		})

		const block = await blockResolver.resolve.NetworkHash.resolve({
			$network: network,
			hash: 'A'.repeat(64),
		})
		expect(blockResolver.projections.hash(block)).toBe('a'.repeat(64))
		expect(blockResolver.projections.slot(block)).toBe(130_000_102n)
		expect(blockResolver.projections.issuerVkey(block)).toBe('vrf_vk1example')

		const transaction = await transactionResolver.resolve.NetworkHash.resolve({
			$network: network,
			hash: 'C'.repeat(64),
		})
		expect(transactionResolver.projections.fee(transaction)).toBe(170000n)
		expect(transactionResolver.projections.ttlSlot(transaction)).toBe(130_000_200n)
		expect(transactionResolver.projections.$$assets(transaction, {
			$network: network,
			hash: 'C'.repeat(64),
		})).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				policyId: 'd'.repeat(56),
				assetName: 'cafe',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'fingerprint')]: 'asset1mint',
			},
		}])

		const asset = await assetResolver.resolve.NetworkPolicyIdAssetName.resolve({
			$network: network,
			policyId: 'E'.repeat(56),
			assetName: 'AbCd',
		})
		expect(assetResolver.projections.fingerprint(asset)).toBe('asset1example')
		expect(assetResolver.projections.$$timestamps(asset)).toEqual([{
			[EntityMetaKey.Selector]: {
				$asset: {
					$network: network,
					policyId: 'E'.repeat(56),
					assetName: 'AbCd',
				},
				slot: 130_000_102n,
				source: Source.Cardanoscan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'timestampMs')]: tipTimestampMs,
				[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'blockHash')]: 'a'.repeat(64),
				[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'supply')]: 1000n,
				[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'transactionCount')]: 3,
			},
		}])
	})

	it('rejects non-Cardano networks', async () => {
		await expect(
			networkTipResolver.resolve.Slug.resolve({
				slug: 'ethereum',
			})
		).rejects.toThrow('unsupported network')
	})

	it('rejects historical Cardano network observations the live tip cannot serve', async () => {
		getLatestBlock.mockResolvedValue(tipBlock)
		getNetworkState.mockResolvedValue({
			circulatingSupply: '35000000000000000',
			reserves: '1000',
			treasury: '2000',
			liveCirculatingSupply: '35000000000000000',
		})

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: tipTimestampMs - 1,
			source: Source.Cardanoscan_Rest,
		})).rejects.toThrow('Cardanoscan_Rest: historical observation is unavailable')

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: tipTimestampMs,
			source: Source.Constants_Internal,
		})).rejects.toThrow('Cardanoscan_Rest: observation source mismatch')

		await expect(networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: tipTimestampMs,
			source: Source.Cardanoscan_Rest,
		})).resolves.toMatchObject({
			timestampMs: tipTimestampMs,
			latestSlot: 130_000_102n,
			latestBlockHash: 'a'.repeat(64),
			epoch: 500,
		})
	})
})
