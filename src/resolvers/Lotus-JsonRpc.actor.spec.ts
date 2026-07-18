import { beforeEach, expect, it, vi } from 'vitest'

import { filecoinNetworkBySlug } from '$/constants/FilecoinNetwork.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import { loadAllResolvers } from '$/resolvers/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { FilecoinActorSelector } from '$/schema/FilecoinActor.ts'
import { FilecoinActor_TimestampSelector } from '$/schema/FilecoinActor_Timestamp.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getActor = vi.fn()
const getHead = vi.fn()

vi.mock('$/sources/Lotus/JsonRpc/queries.ts', () => ({
	getActor,
	getHead,
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
const network = { slug: filecoinNetworkBySlug.filecoin.slug }
const actorSelector = {
	$network: network,
	address: 'f01234',
}
const resolverModules = await loadAllResolvers()
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

if (indexedActorResolver == null || actorResolver == null || actorTimestampResolver == null)
	throw new Error('missing indexed Lotus actor resolvers')

beforeEach(() => {
	getActor.mockReset()
	getHead.mockReset()
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

it('materializes the exact-head selector from the parent and mutable zero values only on that observation', async () => {
	getHead.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
	})
	getActor.mockResolvedValue({
		Code: { '/': 'bafy-code' },
		Nonce: 0,
		Balance: '0',
		Head: { '/': 'bafy-state' },
	})

	await expect(actorResolver.resolve[FilecoinActorSelector.NetworkAddress].resolve(
		actorSelector,
		context
	)).resolves.toEqual({
		$$timestamps: [{
			$actor: actorSelector,
			height: 123n,
			tipsetKey: 'bafy-head',
			source: Source.Lotus_JsonRpc,
		}],
	})
	expect(getActor).not.toHaveBeenCalled()

	await expect(actorTimestampResolver.resolve[FilecoinActor_TimestampSelector.ActorHeightTipsetKeySource].resolve({
		$actor: actorSelector,
		height: 123n,
		tipsetKey: 'bafy-head',
		source: Source.Lotus_JsonRpc,
	}, context)).resolves.toMatchObject({
		height: 123n,
		tipsetKey: 'bafy-head',
		actorCodeCid: 'bafy-code',
		nonce: 0n,
		balanceAttoFil: 0n,
		stateRootCid: 'bafy-state',
	})
	expect(getActor).toHaveBeenCalledWith({
		rpcUrl: filecoinNetworkBySlug.filecoin.lotusRpcUrl,
		address: actorSelector.address,
		tipsetKey: [{ '/': 'bafy-head' }],
	})
})

it.each([
	{
		name: 'height',
		height: 122n,
		tipsetKey: 'bafy-head',
		source: Source.Lotus_JsonRpc,
	},
	{
		name: 'tipset key',
		height: 123n,
		tipsetKey: 'bafy-other',
		source: Source.Lotus_JsonRpc,
	},
])('rejects a mixed-head $name without reading mutable actor state', async ({ name: _name, ...selector }) => {
	getHead.mockResolvedValue({
		Height: 123,
		Cids: [{ '/': 'bafy-head' }],
	})

	await expect(actorTimestampResolver.resolve[FilecoinActor_TimestampSelector.ActorHeightTipsetKeySource].resolve({
		$actor: actorSelector,
		...selector,
	}, context)).rejects.toThrow('is not the current head')
	expect(getActor).not.toHaveBeenCalled()
})

it('rejects another source before reading the head or actor', async () => {
	await expect(actorTimestampResolver.resolve[FilecoinActor_TimestampSelector.ActorHeightTipsetKeySource].resolve({
		$actor: actorSelector,
		height: 123n,
		tipsetKey: 'bafy-head',
		source: Source.Filfox_Rest,
	}, context)).rejects.toThrow('unsupported actor observation source')
	expect(getHead).not.toHaveBeenCalled()
	expect(getActor).not.toHaveBeenCalled()
})
