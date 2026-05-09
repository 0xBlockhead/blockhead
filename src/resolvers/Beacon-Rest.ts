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
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Beacon_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: async (entityId) => {
				const { epoch } = entityId
				return {
					startSlot: epoch * slotsPerEpoch,
					endSlot: (epoch * slotsPerEpoch) + slotsPerEpoch - 1,
					slotCount: slotsPerEpoch,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BeaconSlot,
			resolve: async (entityId) => {
				const { getBeaconHeader } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, slot } = entityId
				const base = beaconRestBaseByExecutionChainId[$network.chainId]
				if (base == null) return {
					epoch: Math.floor(slot / slotsPerEpoch),
				}
				const header = await singleFlight(getBeaconHeader)(base, slot)
				return {
					bodyRoot: header.bodyRoot,
					canonical: header.canonical,
					epoch: Math.floor(header.slot / slotsPerEpoch),
					parentRoot: header.parentRoot,
					proposerIndex: header.proposerIndex,
					root: header.root,
					stateRoot: header.stateRoot,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.BeaconEpoch,
			fieldName: '$$beaconSlots',
			resolve: async (entityId, context) => {
				const { $network, epoch } = entityId
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Beacon_Rest: BeaconEpoch $$beaconSlots requires query limit')
				return (
					Array.from(
						{ length: Math.min(limit, slotsPerEpoch) },
						(_, i) => (epoch * slotsPerEpoch) + i,
					)
						.map((slot) => ({
							[EntityMetaKey.Id]: {
								$network,
								slot,
							},
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconEpochs',
			resolve: async (entityId, context) => {
				const { getBeaconHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Beacon_Rest: Network $$beaconEpochs requires query limit')
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) return []
				const headSlot = await singleFlight(getBeaconHeadSlot)(base)
				const headEpoch = Math.floor(headSlot / slotsPerEpoch)
				return (
					Array.from(
						{ length: limit },
						(_, i) => headEpoch - i,
					)
						.flatMap((epoch) => (
							epoch < 0 ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										$network: { chainId },
										epoch,
									},
								},
							]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconSlots',
			resolve: async (entityId, context) => {
				const { getBeaconHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				if (limit == null) throw new Error('Beacon_Rest: Network $$beaconSlots requires query limit')
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) return []
				const headSlot = await singleFlight(getBeaconHeadSlot)(base)
				return (
					Array.from(
						{ length: limit },
						(_, i) => headSlot - i,
					)
						.flatMap((slot) => (
							slot < 0 ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: {
										$network: { chainId },
										slot,
									},
								},
							]
						))
				)
			},
		}),
	],
}
