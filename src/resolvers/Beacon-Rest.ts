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
import type { BeaconFinalityCheckpoints } from '$/sources/Beacon/Rest/types.ts'

const beaconFinalityCheckpointsForChain = async (
	chainId: number,
): Promise<BeaconFinalityCheckpoints | undefined> => {
	const base = beaconRestBaseByExecutionChainId[chainId]
	if (base == null) return undefined
	const { getBeaconFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
	return singleFlight(getBeaconFinalityCheckpoints)(base)
}

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

		defineEntityResolver({
			entityType: EntityType.BeaconValidator,
			resolve: async (entityId) => {
				const { getBeaconValidatorSummaryAtHead } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, validatorIndex } = entityId
				const base = beaconRestBaseByExecutionChainId[$network.chainId]
				if (base == null) return {}
				const summary = await singleFlight(getBeaconValidatorSummaryAtHead)(base, validatorIndex)
				if (summary == null) return {}
				return {
					balanceGwei: summary.balanceGwei,
					effectiveBalanceGwei: summary.effectiveBalanceGwei,
					pubkey: summary.pubkey,
					slashed: summary.slashed,
					status: summary.status,
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
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconEpochs unsupported for chain ${String(chainId)}`)
				}
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
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSlots unsupported for chain ${String(chainId)}`)
				}
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

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconValidators',
			resolve: async (entityId, context) => {
				const { getBeaconRecentProposerValidatorIndices } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconValidators unsupported for chain ${String(chainId)}`)
				}
				const validatorIndices = await getBeaconRecentProposerValidatorIndices({
					beaconRestBaseUrl: base,
					limit,
					slotLookbackCap: Math.min(384, Math.max(limit * 8, slotsPerEpoch)),
				})
				return (
					validatorIndices.map((validatorIndex) => ({
						[EntityMetaKey.Id]: {
							$network: { chainId },
							validatorIndex,
						},
					}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconPreviousJustifiedCheckpointEpoch',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.previousJustified.epoch
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconPreviousJustifiedCheckpointRoot',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.previousJustified.root
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconCurrentJustifiedCheckpointEpoch',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.currentJustified.epoch
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconCurrentJustifiedCheckpointRoot',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.currentJustified.root
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconFinalizedCheckpointEpoch',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.finalized.epoch
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconFinalizedCheckpointRoot',
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.chainId)
				return checkpoints?.finalized.root
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'beaconForkScheduleEntriesJson',
			resolve: async (entityId) => {
				const { chainId } = entityId
				const base = beaconRestBaseByExecutionChainId[chainId]
				if (base == null) return undefined
				const { getBeaconForkSchedule } = await import('$/sources/Beacon/Rest/queries.ts')
				const entries = await singleFlight(getBeaconForkSchedule)(base)
				return (
					entries.length ?
						JSON.stringify(entries)
					:
						undefined
				)
			},
		}),
	],
}
