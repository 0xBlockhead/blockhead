import { beforeEach, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getActor = vi.fn()

const getBlockHeader = vi.fn()
const getHead = vi.fn()
const getIdAddress = vi.fn()
const getMinerPower = vi.fn()
const getMinerSectors = vi.fn()
const getMarketStorageDeal = vi.fn()
const getNetworkVersion = vi.fn()
const getTipSet = vi.fn()
const getTipSetByHeight = vi.fn()
const getVersion = vi.fn()

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getActor,
	getBlockHeader,
	getHead,
	getIdAddress,
	getMinerPower,
	getMinerSectors,
	getMarketStorageDeal,
	getNetworkVersion,
	getTipSet,
	getTipSetByHeight,
	getVersion,
}))

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [Source.Lotus_JsonRpc],
	publicEnv: {},
}
const network = { slug: networkBySlug.filecoin.slug }
const actorSelector = {
	$network: network,
	address: 'f01234',
}
const resolverModules = await loadResolvers()
const indexed = indexResolvers(
	schema,
	resolverModules,
	new Set([
		Source.Lotus_JsonRpc,
		Source.Filfox_Rest,
	])
)
const indexedActorResolver = indexed.resolverDefinitions.find((resolver) => (
	resolver.source === Source.Lotus_JsonRpc
	&& resolver.entityType === EntityType.FilecoinActor
))
const lotusResolvers = resolverModules.find(({ source }) => source === Source.Lotus_JsonRpc)
const actorResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinActor)
const actorTimestampResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinActor_Timestamp)
const blockResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinBlock)
const networkTimestampResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinNetwork_Timestamp)
const tipsetResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinTipset)
const minerResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinMiner)
const dealResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinDeal)
const dealTimestampResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinDeal_Timestamp)
const networkTipsetsResolver = lotusResolvers?.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Filecoin' in resolver.projections
	&& '$$tipsets' in resolver.projections.Filecoin
))

if (indexedActorResolver == null || actorResolver == null || actorTimestampResolver == null || blockResolver == null || networkTimestampResolver == null || tipsetResolver == null || minerResolver == null || dealResolver == null || dealTimestampResolver == null || networkTipsetsResolver == null)
	throw new Error('missing indexed Lotus actor resolvers')

beforeEach(() => {
	getActor.mockReset()
	getBlockHeader.mockReset()
	getHead.mockReset()
	getIdAddress.mockReset()
	getMinerPower.mockReset()
	getMinerSectors.mockReset()
	getMarketStorageDeal.mockReset()
	getNetworkVersion.mockReset()
	getTipSet.mockReset()
	getTipSetByHeight.mockReset()
	getVersion.mockReset()
})

it('keys deal observations only by the Lotus head source clock', async () => {
	getHead.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
		Blocks: [{
			Timestamp: 1_750_000_000,
		}],
	})
	getMarketStorageDeal.mockResolvedValue({
		Proposal: {
			Provider: 'f01234',
			Client: 'f05678',
			PieceCID: { '/': 'bafy-piece' },
			PieceSize: 128,
			VerifiedDeal: true,
			StartEpoch: 100,
			EndEpoch: 200,
			StoragePricePerEpoch: '3',
			ProviderCollateral: '4',
			ClientCollateral: '5',
		},
		State: {
			SectorStartEpoch: 110,
			LastUpdatedEpoch: 120,
			SlashEpoch: -1,
		},
	})
	const selector = {
		$network: network,
		dealId: 7n,
	}

	const deal = await dealResolver.resolve.NetworkDealId.resolve(selector, context)
	const observation = dealResolver.projections.$$timestamps(deal)[0][EntityMetaKey.Selector]
	await expect(dealTimestampResolver.resolve.DealTimestampMsSource.resolve(
		observation,
		context
	)).resolves.toMatchObject({
		timestampMs: 1_750_000_000_000,
		height: 123n,
	})
	await expect(dealTimestampResolver.resolve.DealTimestampMsSource.resolve({
		...observation,
		timestampMs: observation.timestampMs - 1,
	}, context)).rejects.toThrow('timestamp does not match current head')
})

it('paginates native tipset and miner-sector hierarchies without repeating the first page', async () => {
	getHead
		.mockResolvedValueOnce({
			Height: 3,
			Cids: [{ '/': 'bafy-head' }],
			Blocks: [{
				Timestamp: 1_750_000_000,
			}],
		})
		.mockResolvedValueOnce({
			Height: 3,
			Cids: [{ '/': 'bafy-head' }],
			Blocks: [{
				Timestamp: 1_750_000_000,
			}],
		})
	getTipSetByHeight.mockResolvedValueOnce({
		Height: 2,
		Cids: [{ '/': 'bafy-height-2' }],
		Blocks: [{
			Timestamp: 1_749_999_970,
		}],
	})
	getMinerSectors.mockResolvedValueOnce([
		{
			SectorNumber: 1,
			SealedCID: { '/': 'bafy-sector-1' },
			Activation: 10,
			Expiration: 100,
		},
		{
			SectorNumber: 2,
			SealedCID: { '/': 'bafy-sector-2' },
			Activation: 20,
			Expiration: 200,
		},
	])

	const pageContext = {
		...context,
		pagination: {
			limit: 1,
			offset: 1,
		},
	}
	const tipsets = await networkTipsetsResolver.resolve.Slug.resolve(network, pageContext)
	expect(networkTipsetsResolver.projections.Filecoin.$$tipsets(tipsets)[0][EntityMetaKey.Selector]).toEqual({
		$network: network,
		height: 2n,
		tipsetKey: 'bafy-height-2',
	})

	const miner = await minerResolver.resolve.NetworkMinerAddress.resolve({
		$network: network,
		minerAddress: 'f01234',
	}, pageContext)
	expect(minerResolver.projections.$$sectors(miner).map((sector) => sector[EntityMetaKey.Selector])).toEqual([{
		$miner: {
			$network: network,
			minerAddress: 'f01234',
		},
		sectorNumber: 2n,
	}])
})

it('indexes the clocked Lotus observation relation on the stable actor', () => {
	expect(indexed.resolverParts.filter(({ resolver }) => resolver === indexedActorResolver).map(({ fieldName }) => fieldName)).toEqual([
		'$$timestamps',
	])
})

it('resolves a block linked by an historical tipset without substituting mutable head data', async () => {
	getTipSet.mockResolvedValue({
		Cids: [{
			'/': 'bafy-historical-block',
		}],
		Blocks: [{
			Miner: 'f09876',
			Ticket: {
				VRFProof: 'historical-ticket-proof',
			},
			ElectionProof: {
				WinCount: 2,
			},
			Parents: [{
				'/': 'bafy-parent-tipset',
			}],
			ParentWeight: '9',
			Height: 122,
			Timestamp: 1_750_000_030,
			Messages: {
				'/': 'bafy-messages',
			},
		}],
		Height: 122,
	})
	const tipset = await tipsetResolver.resolve.NetworkHeightTipsetKey.resolve({
		$network: network,
		height: 122n,
		tipsetKey: 'bafy-historical-block',
	}, context)
	expect(tipset.$$blocks.map((block) => block[EntityMetaKey.Selector])).toEqual([{
		$network: network,
		cid: 'bafy-historical-block',
	}])

	getBlockHeader.mockResolvedValue({
		Miner: 'f09876',
		Ticket: {
			VRFProof: 'historical-ticket-proof',
		},
		ElectionProof: {
			WinCount: 2,
		},
		Parents: [{
			'/': 'bafy-parent-tipset',
		}],
		ParentWeight: '9',
		Height: 122,
		Timestamp: 1_750_000_030,
		Messages: {
			'/': 'bafy-messages',
		},
	})

	await expect(blockResolver.resolve.NetworkCid.resolve({
		$network: network,
		cid: 'bafy-historical-block',
	}, context)).resolves.toEqual({
		$miner: {
			[EntityMetaKey.Selector]: {
				$network: network,
				minerAddress: 'f09876',
			},
		},
		ticketVrFProof: 'historical-ticket-proof',
		winCount: 2,
	})
	expect(getBlockHeader).toHaveBeenCalledWith({
		blockCid: 'bafy-historical-block',
	})
	expect(getHead).not.toHaveBeenCalled()
})

it('materializes current and historical actor state only at the exact selected tipset', async () => {
	getHead.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
		Blocks: [{
			Timestamp: 1_750_000_000,
		}],
	})
	getTipSet.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
		Blocks: [{
			Timestamp: 1_750_000_000,
		}],
	})
	getActor.mockResolvedValue({
		Code: { '/': 'bafy-code' },
		Nonce: 0,
		Balance: '0',
		Head: { '/': 'bafy-state' },
	})
	getIdAddress.mockResolvedValue('f01234')

	await expect(actorResolver.resolve['NetworkAddress'].resolve(
		actorSelector,
		context
	)).resolves.toEqual({
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$actor: actorSelector,
				timestampMs: 1_750_000_000_000,
				height: 123n,
				tipsetKey: 'bafy-head',
				source: Source.Lotus_JsonRpc,
			},
		}],
	})
	expect(getActor).not.toHaveBeenCalled()

	await expect(actorTimestampResolver.resolve['ActorHeightTipsetKeySource'].resolve({
		$actor: actorSelector,
		timestampMs: 1_750_000_000_000,
		height: 123n,
		tipsetKey: 'bafy-head',
		source: Source.Lotus_JsonRpc,
	}, context)).resolves.toMatchObject({
		timestampMs: 1_750_000_000_000,
		height: 123n,
		tipsetKey: 'bafy-head',
		idAddress: 'f01234',
		actorCodeCid: 'bafy-code',
		nonce: 0n,
		balanceAttoFil: 0n,
		stateRootCid: 'bafy-state',
	})
	expect(getActor).toHaveBeenCalledWith({
		address: actorSelector.address,
		tipsetKey: [{ '/': 'bafy-head' }],
	})
	expect(getIdAddress).toHaveBeenCalledWith({
		address: actorSelector.address,
		tipsetKey: [{ '/': 'bafy-head' }],
	})
})

it.each([
	{
		name: 'timestamp',
		timestampMs: 1_750_000_001_000,
		height: 123n,
		tipsetKey: 'bafy-head',
		source: Source.Lotus_JsonRpc,
	},
	{
		name: 'height',
		timestampMs: 1_750_000_000_000,
		height: 122n,
		tipsetKey: 'bafy-head',
		source: Source.Lotus_JsonRpc,
	},
	{
		name: 'tipset key',
		timestampMs: 1_750_000_000_000,
		height: 123n,
		tipsetKey: 'bafy-other',
		source: Source.Lotus_JsonRpc,
	},
])('rejects a mixed-head $name without reading mutable actor state', async ({ name, ...selector }) => {
	getTipSet.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
		Blocks: [{
			Timestamp: 1_750_000_000,
		}],
	})

	await expect(actorTimestampResolver.resolve['ActorHeightTipsetKeySource'].resolve({
		$actor: actorSelector,
		...selector,
	}, context)).rejects.toThrow(
		name === 'timestamp' ?
			'actor observation does not match'
		:
			'tipset does not match'
	)
	expect(getActor).not.toHaveBeenCalled()
	expect(getIdAddress).not.toHaveBeenCalled()
})

it('rejects another source before reading the tipset or actor', async () => {
	await expect(actorTimestampResolver.resolve['ActorHeightTipsetKeySource'].resolve({
		$actor: actorSelector,
		timestampMs: 1_750_000_000_000,
		height: 123n,
		tipsetKey: 'bafy-head',
		source: Source.Filfox_Rest,
	}, context)).rejects.toThrow('unsupported actor observation source')
	expect(getTipSet).not.toHaveBeenCalled()
	expect(getActor).not.toHaveBeenCalled()
})

it('resolves a persisted network observation from its immutable tipset', async () => {
	getTipSet.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-observed' }],
		Blocks: [{
			Miner: 'f01234',
			Timestamp: 1_750_000_000,
		}],
	})
	getVersion.mockResolvedValue({
		Version: '1.32.0',
		Agent: 'lotus',
		BlockDelay: 30,
	})
	getNetworkVersion.mockResolvedValue(25)
	getMinerPower.mockResolvedValue({
		TotalPower: {
			RawBytePower: '1',
			QualityAdjPower: '2',
		},
	})

	await expect(networkTimestampResolver.resolve['NetworkTimestampMsSource'].resolve({
		$network: network,
		timestampMs: 1_750_000_000_000,
		height: 123n,
		tipsetKey: 'bafy-observed',
		source: Source.Lotus_JsonRpc,
	}, context)).resolves.toMatchObject({
		headHeight: 123n,
		headTipsetKey: 'bafy-observed',
		headTimestampMs: 1_750_000_000_000,
		networkVersion: 25,
	})
	expect(getTipSet).toHaveBeenCalledWith({
		tipsetKey: [{ '/': 'bafy-observed' }],
	})
	expect(getHead).not.toHaveBeenCalled()
})
