import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getBlock = vi.hoisted(() => vi.fn())
const getBlockMessages = vi.hoisted(() => vi.fn())
const getDeal = vi.hoisted(() => vi.fn())
const getDeals = vi.hoisted(() => vi.fn())
const getMessage = vi.hoisted(() => vi.fn())
const getTipset = vi.hoisted(() => vi.fn())
const getAddress = vi.hoisted(() => vi.fn())
const getOverview = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Filfox/Rest/queries.ts', () => ({
	getBlock,
	getBlockMessages,
	getDeal,
	getDeals,
	getMessage,
	getTipset,
	getAddress,
	getOverview,
}))

const { default: filfoxRest } = await import('$/resolvers/Filfox-Rest.ts')

const network = {
	slug: networkBySlug.filecoin.slug,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 8,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.Filfox_Rest],
	publicEnv: {},
}

const tipsetResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinTipset
))
const blockResolvers = filfoxRest.resolvers.filter((resolver) => (
	resolver.entityType === EntityType.FilecoinBlock
))
const blockResolver = blockResolvers.find((resolver) => (
	'$tipset' in resolver.projections
))
const blockMessagesResolver = blockResolvers.find((resolver) => (
	'$$messages' in resolver.projections
))
const messageResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMessage
))
const dealResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinDeal
))
const filecoinNetworkDealsResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinNetwork
))
const networkDealsResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
))
const minerResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMiner
))
const minerTimestampResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinMiner_Timestamp
))
const actorResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinActor
))
const actorTimestampResolver = filfoxRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.FilecoinActor_Timestamp
))

if (
	tipsetResolver == null
	|| blockResolver == null
	|| blockMessagesResolver == null
	|| messageResolver == null
	|| dealResolver == null
	|| filecoinNetworkDealsResolver == null
	|| networkDealsResolver == null
	|| minerResolver == null
	|| minerTimestampResolver == null
	|| actorResolver == null
	|| actorTimestampResolver == null
)
	throw new Error('Filfox-Rest spec missing required resolvers')

describe('Filfox REST resolvers', () => {
	beforeEach(() => {
		getBlock.mockReset()
		getBlockMessages.mockReset()
		getDeal.mockReset()
		getDeals.mockReset()
		getMessage.mockReset()
		getTipset.mockReset()
		getAddress.mockReset()
		getOverview.mockReset()
	})

	it('registers chain, deal, miner, and actor product surfaces', () => {
		expect(filfoxRest.source).toBe(Source.Filfox_Rest)
		expect(filfoxRest.resolvers.map((resolver) => resolver.entityType)).toEqual([
			EntityType.FilecoinTipset,
			EntityType.FilecoinBlock,
			EntityType.FilecoinMessage,
			EntityType.FilecoinBlock,
			EntityType.FilecoinMiner,
			EntityType.FilecoinMiner_Timestamp,
			EntityType.FilecoinActor,
			EntityType.FilecoinActor_Timestamp,
			EntityType.FilecoinDeal,
			EntityType.FilecoinNetwork,
			EntityType.Network,
		])
	})

	it('rejects non-Filecoin networks before HTTP', async () => {
		await expect(tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: {
				slug: 'ethereum',
			},
			height: 1n,
			tipsetKey: 'bafy-a',
		}, context)).rejects.toThrow('Filfox_Rest: unsupported network')
		expect(getTipset).not.toHaveBeenCalled()
	})

	it('resolves tipset blocks and parent weight when the tipset key matches', async () => {
		getTipset.mockResolvedValueOnce({
			height: 10,
			timestamp: 1_700_000_000,
			blocks: [
				{
					cid: 'bafy-a',
					miner: 'f01',
					winCount: 1,
				},
				{
					cid: 'bafy-b',
					miner: 'f02',
				},
			],
		})
		getBlock.mockResolvedValueOnce({
			cid: 'bafy-a',
			height: 10,
			timestamp: 1_700_000_000,
			miner: 'f01',
			winCount: 1,
			parents: [
				'bafy-parent-a',
				'bafy-parent-b',
			],
			parentWeight: '99',
			messageCount: 2,
		})

		const snapshot = await tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: network,
			height: 10n,
			tipsetKey: 'bafy-a,bafy-b',
		}, context)

		expect(tipsetResolver.projections.timestampMs(snapshot)).toBe(1_700_000_000_000)
		expect(tipsetResolver.projections.parentWeight(snapshot)).toBe(99n)
		expect(tipsetResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 9n,
				tipsetKey: 'bafy-parent-a,bafy-parent-b',
			},
		})
		expect(tipsetResolver.projections.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-a',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							height: 10n,
							tipsetKey: 'bafy-a,bafy-b',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							minerAddress: 'f01',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], 'winCount')]: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-b',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$tipset')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							height: 10n,
							tipsetKey: 'bafy-a,bafy-b',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinBlock, [], '$miner')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							minerAddress: 'f02',
						},
					},
				},
			},
		])
	})

	it('hard-fails mismatched tipset keys without soft-emptying blocks', async () => {
		getTipset.mockResolvedValueOnce({
			height: 10,
			timestamp: 1_700_000_000,
			blocks: [{
				cid: 'bafy-a',
				miner: 'f01',
			}],
		})

		await expect(tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
			$network: network,
			height: 10n,
			tipsetKey: 'bafy-other',
		}, context)).rejects.toThrow('Filfox_Rest: tipset does not match 10/bafy-other')
		expect(getBlock).not.toHaveBeenCalled()
	})

	it('projects message from/to fields from one Filfox message response', async () => {
		getMessage.mockResolvedValueOnce({
			cid: 'bafy-msg',
			from: 'f1from',
			to: 'f1to',
			nonce: 3,
			value: '1000',
			method: 'Send',
			methodNumber: 0,
			gasLimit: 50_000_000,
		})

		const snapshot = await messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-msg',
		}, context)

		expect(messageResolver.projections.$from(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1from',
			},
		})
		expect(messageResolver.projections.$to(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1to',
			},
		})
		expect(messageResolver.projections.method(snapshot)).toBe(0)
		expect(messageResolver.projections.nonce(snapshot)).toBe(3n)
		expect(messageResolver.projections.valueAttoFil(snapshot)).toBe(1000n)
		expect(messageResolver.projections.gasLimit(snapshot)).toBe(50_000_000n)
	})

	it('propagates hard-fail HTTP from message lookup', async () => {
		getMessage.mockRejectedValueOnce(new Error('GET https://filfox.info/api/v1/message/missing → 404'))

		await expect(messageResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'missing',
		}, context)).rejects.toThrow('404')
	})

	it('lists block messages with nested field enrichment', async () => {
		getBlockMessages.mockResolvedValueOnce({
			totalCount: 1,
			messages: [{
				cid: 'bafy-msg',
				from: 'f1from',
				to: 'f1to',
				nonce: 1,
				value: '2',
				method: 'Send',
			}],
		})

		const snapshot = await blockMessagesResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-block',
		}, context)

		expect(blockMessagesResolver.projections.$$messages(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					cid: 'bafy-msg',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$from')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: 'f1from',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], '$to')]: {
						[EntityMetaKey.Selector]: {
							$network: network,
							address: 'f1to',
						},
					},
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'nonce')]: 1n,
					[entityFieldAddressKey(EntityType.FilecoinMessage, [], 'valueAttoFil')]: 2n,
				},
			},
		])
		expect(getBlockMessages).toHaveBeenCalledWith({
			blockCid: 'bafy-block',
			pageSize: 8,
		})
	})

	it('resolves block tipset and miner from block + tipset fetches', async () => {
		getBlock.mockResolvedValueOnce({
			cid: 'bafy-block',
			height: 11,
			timestamp: 1_700_000_030,
			miner: 'f03',
			winCount: 2,
			parents: ['bafy-p'],
			parentWeight: '1',
			messageCount: 0,
		})
		getTipset.mockResolvedValueOnce({
			height: 11,
			timestamp: 1_700_000_030,
			blocks: [
				{
					cid: 'bafy-block',
					miner: 'f03',
				},
				{
					cid: 'bafy-sib',
					miner: 'f04',
				},
			],
		})

		const snapshot = await blockResolver.resolve.NetworkCid.resolve({
			$network: network,
			cid: 'bafy-block',
		}, context)

		expect(blockResolver.projections.$tipset(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 11n,
				tipsetKey: 'bafy-block,bafy-sib',
			},
		})
		expect(blockResolver.projections.$miner(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				minerAddress: 'f03',
			},
		})
		expect(blockResolver.projections.winCount(snapshot)).toBe(2)
	})

	it('resolves Filecoin deal detail from the official detail response', async () => {
		getDeal.mockResolvedValueOnce({
			id: 42,
			height: 100,
			timestamp: 1_700_000_000,
			pieceCid: 'baga-piece',
			pieceSize: 2048,
			verifiedDeal: true,
			client: 'f1client',
			clientTag: {
				name: 'Official',
				signed: false,
			},
			provider: 'f01000',
			providerTag: {
				name: 'Official',
				signed: false,
			},
			startEpoch: 101,
			startTimestamp: 1_700_000_030,
			endEpoch: 201,
			endTimestamp: 1_700_003_030,
			storagePricePerEpoch: '3',
			stroagePrice: '3',
			clientCollateral: '4',
			providerCollateral: '5',
		})

		const snapshot = await dealResolver.resolve.NetworkDealId.resolve({
			$network: network,
			dealId: 42n,
		}, context)

		expect(dealResolver.projections.$provider(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				minerAddress: 'f01000',
			},
		})
		expect(dealResolver.projections.$client(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1client',
			},
		})
		expect(dealResolver.projections.pieceCid(snapshot)).toBe('baga-piece')
		expect(dealResolver.projections.pieceSizeBytes(snapshot)).toBe(2048n)
		expect(dealResolver.projections.storagePricePerEpochAttoFil(snapshot)).toBe(3n)
		expect(dealResolver.projections.providerCollateralAttoFil(snapshot)).toBe(5n)
		expect(dealResolver.projections.clientCollateralAttoFil(snapshot)).toBe(4n)
		expect(dealResolver.projections.$$timestamps(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$deal: {
						$network: network,
						dealId: 42n,
					},
					timestampMs: 1_700_000_000_000,
					source: Source.Filfox_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'height')]: 100n,
					[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'verifiedDeal')]: true,
					[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'providerCollateralAttoFil')]: 5n,
					[entityFieldAddressKey(EntityType.FilecoinDeal_Timestamp, [], 'clientCollateralAttoFil')]: 4n,
				},
			},
		])
	})

	it('lists deals through FilecoinNetwork and Network Filecoin projections', async () => {
		getDeals.mockResolvedValue({
			totalCount: 1,
			deals: [{
				id: 42,
				height: 100,
				timestamp: 1_700_000_000,
				pieceSize: 2048,
				verifiedDeal: true,
				client: 'f1client',
				provider: 'f01000',
				startEpoch: 101,
				startTimestamp: 1_700_000_030,
				endEpoch: 201,
				endTimestamp: 1_700_003_030,
				stroagePrice: '3',
			}],
		})

		const expected = [{
			[EntityMetaKey.Selector]: {
				$network: network,
				dealId: 42n,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], '$provider')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						minerAddress: 'f01000',
					},
				},
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], '$client')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						address: 'f1client',
					},
				},
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'pieceSizeBytes')]: 2048n,
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'verifiedDeal')]: true,
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'startEpoch')]: 101n,
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'endEpoch')]: 201n,
				[entityFieldAddressKey(EntityType.FilecoinDeal, [], 'storagePricePerEpochAttoFil')]: 3n,
			},
		}]

		expect(filecoinNetworkDealsResolver.projections.$$deals(
			await filecoinNetworkDealsResolver.resolve.Network.resolve({
				$network: network,
			}, context)
		)).toEqual(expected)
		expect(networkDealsResolver.projections.Filecoin.$$deals(
			await networkDealsResolver.resolve.Slug.resolve(network, context)
		)).toEqual(expected)
		expect(getDeals).toHaveBeenNthCalledWith(1, {
			page: 0,
			pageSize: 8,
		})
	})

	it('maps Filfox address power into miner observations keyed by tipset', async () => {
		getOverview.mockResolvedValue({
			height: 100,
			timestamp: 1_700_000_000,
		})
		getTipset.mockResolvedValue({
			height: 100,
			timestamp: 1_700_000_000,
			blocks: [
				{
					cid: 'bafy1',
					miner: 'f01000',
				},
				{
					cid: 'bafy2',
					miner: 'f01001',
				},
			],
		})
		getAddress.mockResolvedValue({
			id: 'f01000',
			address: 'f01000',
			balance: '1',
			miner: {
				owner: {
					address: 'f1owner',
					balance: '2',
				},
				worker: {
					address: 'f1worker',
					balance: '3',
				},
				peerId: '12D3',
				rawBytePower: '10',
				qualityAdjPower: '20',
				networkRawBytePower: '100',
				networkQualityAdjPower: '200',
				sectors: {
					live: 5,
					active: 4,
					faulty: 1,
				},
			},
		})

		const miner = await minerResolver.resolve.NetworkMinerAddress.resolve({
			$network: network,
			minerAddress: 'f01000',
		}, context)
		expect(minerResolver.projections.$$timestamps(miner)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$miner: {
						$network: network,
						minerAddress: 'f01000',
					},
					height: 100n,
					tipsetKey: 'bafy1,bafy2',
					source: Source.Filfox_Rest,
				},
			},
		])

		const snapshot = await minerTimestampResolver.resolve.MinerHeightTipsetKeySource.resolve({
			$miner: {
				$network: network,
				minerAddress: 'f01000',
			},
			height: 100n,
			tipsetKey: 'bafy1,bafy2',
			source: Source.Filfox_Rest,
		}, context)
		expect(minerTimestampResolver.projections.qualityAdjustedPower(snapshot)).toBe(20n)
		expect(minerTimestampResolver.projections.activeSectorCount(snapshot)).toBe(4)
		expect(minerTimestampResolver.projections.$owner(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				address: 'f1owner',
			},
		})
	})

	it('maps Filfox address balance into actor observations keyed by tipset', async () => {
		getOverview.mockResolvedValue({
			height: 100,
			timestamp: 1_700_000_000,
		})
		getTipset.mockResolvedValue({
			height: 100,
			timestamp: 1_700_000_000,
			blocks: [
				{
					cid: 'bafy1',
					miner: 'f01000',
				},
			],
		})
		getAddress.mockResolvedValue({
			id: 'f01234',
			address: 'f1actor',
			actor: 'account',
			balance: '999',
		})

		const actor = await actorResolver.resolve.NetworkAddress.resolve({
			$network: network,
			address: 'f1actor',
		}, context)
		expect(actorResolver.projections.$$timestamps(actor)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$actor: {
						$network: network,
						address: 'f1actor',
					},
					height: 100n,
					tipsetKey: 'bafy1',
					source: Source.Filfox_Rest,
				},
			},
		])

		const snapshot = await actorTimestampResolver.resolve.ActorHeightTipsetKeySource.resolve({
			$actor: {
				$network: network,
				address: 'f1actor',
			},
			height: 100n,
			tipsetKey: 'bafy1',
			source: Source.Filfox_Rest,
		}, context)
		expect(actorTimestampResolver.projections.idAddress(snapshot)).toBe('f01234')
		expect(actorTimestampResolver.projections.balanceAttoFil(snapshot)).toBe(999n)
		expect(actorTimestampResolver.projections.actorCodeCid(snapshot)).toBe('account')
	})
})
