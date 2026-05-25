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
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	BeaconFinalityCheckpoints,
	BeaconForkScheduleEntry,
} from '$/sources/Beacon/Rest/types.ts'

const requireBeaconRestBaseUrl = (chainId: number) => {
	const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
	if (base == null) {
		throw new Error(`Beacon_Rest: no beacon REST base for chain ${String(chainId)}`)
	}
	return base
}

const beaconFinalityCheckpointsForChain = async (
	chainId: number,
): Promise<BeaconFinalityCheckpoints | undefined> => {
	const base = requireBeaconRestBaseUrl(chainId)
	const { getBeaconFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
	return singleFlight(getBeaconFinalityCheckpoints)(base)
}

const beaconForkScheduleEntryForNetworkConsensusUpgrade = async (
	entityId: EntityId<typeof schema, EntityType.NetworkConsensusUpgrade>,
): Promise<BeaconForkScheduleEntry | undefined> => {
	const { chainId } = entityId.$network
	const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
	const consensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
		`${chainId}:${entityId.upgradeId}`
	]
	const activationEpoch = consensusUpgrade?.activationEpoch
	if (activationEpoch == null) {
		return undefined
	}
	const base = requireBeaconRestBaseUrl(chainId)
	const { getBeaconForkSchedule } = await import('$/sources/Beacon/Rest/queries.ts')
	const schedule = await singleFlight(getBeaconForkSchedule)(base)
	return schedule.find((entry) => entry.epoch === activationEpoch)
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
				const base = requireBeaconRestBaseUrl($network.chainId)
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
				const base = requireBeaconRestBaseUrl($network.chainId)
				const summary = await singleFlight(getBeaconValidatorSummaryAtHead)(base, validatorIndex)
				if (summary == null) {
					throw new Error(
						`Beacon_Rest: validator summary not returned for index ${String(validatorIndex)}`,
					)
				}
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
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
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
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
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
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
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

		defineEntityResolver({
			entityType: EntityType.Network_BeaconFinality_Timestamp,
			resolve: async (entityId) => {
				const checkpoints = await beaconFinalityCheckpointsForChain(entityId.$network.chainId)
				if (checkpoints == null) {
					throw new Error(
						`Beacon_Rest: finality checkpoints not returned for chain ${String(entityId.$network.chainId)}`,
					)
				}
				return {
					currentJustifiedCheckpointEpoch: checkpoints.currentJustified.epoch,
					currentJustifiedCheckpointRoot: checkpoints.currentJustified.root,
					previousJustifiedCheckpointEpoch: checkpoints.previousJustified.epoch,
					previousJustifiedCheckpointRoot: checkpoints.previousJustified.root,
					finalizedCheckpointEpoch: checkpoints.finalized.epoch,
					finalizedCheckpointRoot: checkpoints.finalized.root,
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$beaconFinalityTimestamps',
			resolve: async (entityId) => (
				[
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			fieldName: 'previousForkVersion',
			resolve: async (entityId) => {
				const entry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entityId)
				return entry?.previousVersion
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			fieldName: 'currentForkVersion',
			resolve: async (entityId) => {
				const entry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entityId)
				return entry?.currentVersion
			},
		}),
	],
}
