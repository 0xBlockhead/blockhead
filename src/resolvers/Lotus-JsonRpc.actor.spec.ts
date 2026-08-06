import { beforeEach, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { loadResolvers } from '$/resolvers/index.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getActor = vi.fn()
const getHead = vi.fn()
const getIdAddress = vi.fn()
const getMinerPower = vi.fn()
const getNetworkVersion = vi.fn()
const getTipSet = vi.fn()
const getTipSetByHeight = vi.fn()
const getVersion = vi.fn()

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getActor,
	getHead,
	getIdAddress,
	getMinerPower,
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
const networkTimestampResolver = lotusResolvers?.resolvers.find(({ entityType }) => entityType === EntityType.FilecoinNetwork_Timestamp)

if (indexedActorResolver == null || actorResolver == null || actorTimestampResolver == null || networkTimestampResolver == null)
	throw new Error('missing indexed Lotus actor resolvers')

beforeEach(() => {
	getActor.mockReset()
	getHead.mockReset()
	getIdAddress.mockReset()
	getMinerPower.mockReset()
	getNetworkVersion.mockReset()
	getTipSet.mockReset()
	getTipSetByHeight.mockReset()
	getVersion.mockReset()
})

it('indexes only the clocked Lotus observation relation on the stable actor', () => {
	expect(indexed.resolverParts.filter(({ resolver }) => resolver === indexedActorResolver).map(({ fieldName }) => fieldName)).toEqual([
		'$$timestamps',
	])
	expect(indexed.resolverDefinitions.some((resolver) => (
		resolver.source === Source.Filfox_Rest
		&& (
			resolver.entityType === EntityType.FilecoinActor
			|| resolver.entityType === EntityType.FilecoinActor_Timestamp
		)
	))).toBe(false)
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
