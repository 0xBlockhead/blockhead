import {
	beaconRestBaseByExecutionChainId,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
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
	const { getFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
	return singleFlight(getFinalityCheckpoints)(base)
}

const beaconForkScheduleEntryForNetworkConsensusUpgrade = async (
	entityId: EntityId<typeof schema, EntityType.EthereumConsensusUpgrade>,
): Promise<BeaconForkScheduleEntry | undefined> => {
	const chainId = Number(entityId.$network.caip2.reference)
	const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
	const consensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
		`${chainId}:${entityId.upgradeId}`
	]
	const activationEpoch = consensusUpgrade.activationEpoch
	if (activationEpoch == null) {
		return undefined
	}
	const base = requireBeaconRestBaseUrl(chainId)
	const { getForkSchedule } = await import('$/sources/Beacon/Rest/queries.ts')
	const schedule = await singleFlight(getForkSchedule)(base)
	return schedule.find((forkScheduleEntry) => forkScheduleEntry.epoch === activationEpoch)
}

export default {
	source: Source.Beacon_Rest,

	resolvers: [
		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { epoch } = entityId
				return {
					startSlot: epoch * slotsPerEpoch,
					endSlot: (epoch * slotsPerEpoch) + slotsPerEpoch - 1,
					slotCount: slotsPerEpoch,
				}
			}
			},
		})({
				fields: {
				startSlot: (epoch) => epoch.startSlot,
				endSlot: (epoch) => epoch.endSlot,
				slotCount: (epoch) => epoch.slotCount,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getHeader } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, slot } = entityId
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const header = await singleFlight(getHeader)(base, slot)
				return {
					bodyRoot: with0xHex(header.bodyRoot),
					...(header.canonical != null && { canonical: header.canonical }),
					epoch: Math.floor(header.slot / slotsPerEpoch),
					parentRoot: with0xHex(header.parentRoot),
					proposerIndex: header.proposerIndex,
					root: with0xHex(header.root),
					signature: with0xHex(header.signature),
					stateRoot: with0xHex(header.stateRoot),
				}
			}
			},
		})({
				fields: {
				bodyRoot: (slot) => slot.bodyRoot,
				canonical: (slot) => slot.canonical,
				epoch: (slot) => slot.epoch,
				parentRoot: (slot) => slot.parentRoot,
				proposerIndex: (slot) => slot.proposerIndex,
				root: (slot) => slot.root,
				signature: (slot) => slot.signature,
				stateRoot: (slot) => slot.stateRoot,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconValidator,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getValidatorSummaryAtHead } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, validatorIndex } = entityId
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getValidatorSummaryAtHead)(base, validatorIndex)
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
			}
			},
		})({
				fields: {
				balanceGwei: (validator) => validator.balanceGwei,
				effectiveBalanceGwei: (validator) => validator.effectiveBalanceGwei,
				pubkey: (validator) => validator.pubkey,
				slashed: (validator) => validator.slashed,
				status: (validator) => validator.status,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconCommittee,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const committees = await singleFlight(getCommittees)(base, String(entityId.slot))
				const committee = committees.find((committee) => committee.index === entityId.index)
				if (committee == null) throw new Error('Beacon_Rest: committee not found')
				return {
					validatorIndices: committee.validatorIndices,
				}
			}
			},
		})({
				fields: {
				validatorIndices: (committee) => committee.validatorIndices,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSyncCommittee,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const committee = await singleFlight(getSyncCommittee)(base, 'head')
				if (committee == null) throw new Error('Beacon_Rest: sync committee not found')
				return {
					validatorIndices: committee.validatorIndices,
				}
			}
			},
		})({
				fields: {
				validatorIndices: (committee) => committee.validatorIndices,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconAttestation,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, entityId.slot)
				const attestation = summary.attestations.find((committee) => committee.index === entityId.index)
				if (attestation == null) throw new Error('Beacon_Rest: attestation not found')
				return {
					...(attestation.committeeIndex != null && { committeeIndex: attestation.committeeIndex }),
					...(attestation.aggregationBits != null && { aggregationBits: attestation.aggregationBits }),
				}
			}
			},
		})({
				fields: {
				committeeIndex: (attestation) => attestation.committeeIndex,
				aggregationBits: (attestation) => attestation.aggregationBits,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconWithdrawal,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, entityId.slot)
				const withdrawal = summary.withdrawals.find((committee) => committee.index === entityId.index)
				if (withdrawal == null) throw new Error('Beacon_Rest: withdrawal not found')
				return {
					...(withdrawal.validatorIndex != null && {
						validatorIndex: withdrawal.validatorIndex,
						$validator: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								validatorIndex: withdrawal.validatorIndex,
							},
						},
					}),
					...(withdrawal.address != null && {
						$account: {
							[EntityMetaKey.Id]: {
								address: with0xHex(withdrawal.address),
							},
						},
					}),
					...(withdrawal.amountGwei != null && { amountGwei: withdrawal.amountGwei }),
				}
			}
			},
		})({
				fields: {
				validatorIndex: (withdrawal) => withdrawal.validatorIndex,
				$validator: (withdrawal) => withdrawal.$validator,
				$account: (withdrawal) => withdrawal.$account,
				amountGwei: (withdrawal) => withdrawal.amountGwei,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumBeaconFinality_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const chainId = Number(entityId.$network.caip2.reference)
				const checkpoints = await beaconFinalityCheckpointsForChain(chainId)
				if (checkpoints == null) {
					throw new Error(
						`Beacon_Rest: finality checkpoints not returned for chain ${String(chainId)}`,
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
			}
			},
		})({
				fields: {
				currentJustifiedCheckpointEpoch: (timestamp) => timestamp.currentJustifiedCheckpointEpoch,
				currentJustifiedCheckpointRoot: (timestamp) => timestamp.currentJustifiedCheckpointRoot,
				previousJustifiedCheckpointEpoch: (timestamp) => timestamp.previousJustifiedCheckpointEpoch,
				previousJustifiedCheckpointRoot: (timestamp) => timestamp.previousJustifiedCheckpointRoot,
				finalizedCheckpointEpoch: (timestamp) => timestamp.finalizedCheckpointEpoch,
				finalizedCheckpointRoot: (timestamp) => timestamp.finalizedCheckpointRoot,
			},
			}),
		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { $network, epoch } = entityId
				const limit = resolverContextRowLimit(context)
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
			}
			},
		})({
				fields: {
				$$beaconSlots: (epoch) => epoch,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconEpochs unsupported for chain ${String(chainId)}`)
				}
				const headSlot = await singleFlight(getHeadSlot)(base)
				const headEpoch = Math.floor(headSlot / slotsPerEpoch)
				return (
					Array.from(
						{ length: limit },
						(_, i) => headEpoch - i,
					)
						.flatMap((epoch) => (
							epoch < 0 ?
								[]
							:
								[
								{
									[EntityMetaKey.Id]: {
										$network: entityId,
										epoch,
									},
								},
							]
						))
				)
			}
			},
		})({
				fields: {
				$$beaconEpochs: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSlots unsupported for chain ${String(chainId)}`)
				}
				const headSlot = await singleFlight(getHeadSlot)(base)
				return (
					Array.from(
						{ length: limit },
						(_, i) => headSlot - i,
					)
						.flatMap((slot) => (
							slot < 0 ?
								[]
							:
								[
								{
									[EntityMetaKey.Id]: {
										$network: entityId,
										slot,
									},
								},
							]
						))
				)
			}
			},
		})({
				fields: {
				$$beaconSlots: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getRecentProposerValidatorIndices } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconValidators unsupported for chain ${String(chainId)}`)
				}
				const validatorIndices = await getRecentProposerValidatorIndices({
					beaconRestBaseUrl: base,
					limit,
					slotLookbackCap: Math.min(384, Math.max(limit * 8, slotsPerEpoch)),
				})
				return (
					validatorIndices.map((validatorIndex) => ({
						[EntityMetaKey.Id]: {
							$network: entityId,
							validatorIndex,
						},
					}))
				)
			}
			},
		})({
				fields: {
				$$beaconValidators: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				return (
					(await singleFlight(getCommittees)(base, String(entityId.slot)))
						.slice(0, limit)
						.map((committee) => ({
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								slot: entityId.slot,
								index: committee.index,
							},
						}))
				)
			}
			},
		})({
				fields: {
				$$beaconCommittees: (slot) => slot,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, entityId.slot)
				return summary.attestations.slice(0, limit).map((attestation) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						slot: entityId.slot,
						index: attestation.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconAttestations: (slot) => slot,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, entityId.slot)
				return summary.withdrawals.slice(0, limit).map((withdrawal) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						slot: entityId.slot,
						index: withdrawal.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconWithdrawals: (slot) => slot,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number(entityId.$network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, entityId.slot)
				return summary.slashings.slice(0, limit).map((slashing) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						slot: entityId.slot,
						kind: slashing.kind,
						index: slashing.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconSlashings: (slot) => slot,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconCommittees unsupported for chain ${String(chainId)}`)
				}
				return (
					(await singleFlight(getCommittees)(base))
						.slice(0, limit)
						.map((committee) => ({
							[EntityMetaKey.Id]: {
								$network: entityId,
								slot: committee.slot,
								index: committee.index,
							},
						}))
				)
			}
			},
		})({
				fields: {
				$$beaconCommittees: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSyncCommittees unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							period: Math.floor(Math.floor(slot / slotsPerEpoch) / 256),
						},
					},
				]
			}
			},
		})({
				fields: {
				$$beaconSyncCommittees: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconAttestations unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.attestations.slice(0, limit).map((attestation) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						slot,
						index: attestation.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconAttestations: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconWithdrawals unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.withdrawals.slice(0, limit).map((withdrawal) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						slot,
						index: withdrawal.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconWithdrawals: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(entityId.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSlashings unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.slashings.slice(0, limit).map((slashing) => ({
					[EntityMetaKey.Id]: {
						$network: entityId,
						slot,
						kind: slashing.kind,
						index: slashing.index,
					},
				}))
			}
			},
		})({
				fields: {
				$$beaconSlashings: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => (
				[
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							timestampMs: Date.now(),
						},
					},
				]
			)
			},
		})({
				fields: {
				$$beaconFinalityTimestamps: (network) => network,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const forkScheduleEntry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entityId)
				return forkScheduleEntry?.previousVersion
			}
			},
		})({
				fields: {
				previousForkVersion: (upgrade) => upgrade,
			},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const forkScheduleEntry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entityId)
				return forkScheduleEntry?.currentVersion
			}
			},
		})({
				fields: {
				currentForkVersion: (upgrade) => upgrade,
			},
			}),
	],
}
