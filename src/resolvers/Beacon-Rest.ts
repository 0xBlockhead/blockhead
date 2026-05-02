import {
	beaconRestBaseByExecutionChainId,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineEntityResolver,
	defineEntityFieldResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { getBeaconHeadSlot } from '$/sources/Beacon/Rest/queries.ts'

export default {
	source: Source.Beacon_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: async () => ({}),
		}),
		defineEntityResolver({
			entityType: EntityType.BeaconSlot,
			resolve: async () => ({}),
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconEpochs',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const base = beaconRestBaseByExecutionChainId[entityId.chainId]
				if (base == null) return []
				const headSlot = await singleFlight(getBeaconHeadSlot)(base)
				const headEpoch = Math.floor(headSlot / slotsPerEpoch)
				const chain = entityId.chainId
				return (
					Array.from(
						{ length: limit },
						(_, i) => {
							const epoch = headEpoch - i
							if (epoch < 0) return null
							return {
								[EntityMetaKey.Id]: {
									$network: { chainId: chain },
									epoch,
								},
							} satisfies Entity<typeof schema, EntityType.BeaconEpoch>
						},
					)
						.filter((row): row is Entity<typeof schema, EntityType.BeaconEpoch> => row != null)
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconSlots',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) return []
				const base = beaconRestBaseByExecutionChainId[entityId.chainId]
				if (base == null) return []
				const headSlot = await singleFlight(getBeaconHeadSlot)(base)
				const chain = entityId.chainId
				return (
					Array.from(
						{ length: limit },
						(_, i) => {
							const slot = headSlot - i
							if (slot < 0) return null
							return {
								[EntityMetaKey.Id]: {
									$network: { chainId: chain },
									slot,
								},
							} satisfies Entity<typeof schema, EntityType.BeaconSlot>
						},
					)
						.filter((row): row is Entity<typeof schema, EntityType.BeaconSlot> => row != null)
				)
			},
		}),
	],
}
