import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	beaconRestBaseByExecutionChainId,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	BeaconFinalityCheckpoints,
	BeaconForkScheduleEntry,
} from '$/sources/Beacon/Rest/types.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { BeaconEpochSelector } from '$/schema/BeaconEpoch.ts'
import { BeaconSlotSelector } from '$/schema/BeaconSlot.ts'
import { BeaconValidatorSelector } from '$/schema/BeaconValidator.ts'
import { BeaconCommitteeSelector } from '$/schema/BeaconCommittee.ts'
import { BeaconSyncCommitteeSelector } from '$/schema/BeaconSyncCommittee.ts'
import { BeaconAttestationSelector } from '$/schema/BeaconAttestation.ts'
import { BeaconWithdrawalSelector } from '$/schema/BeaconWithdrawal.ts'
import { EthereumBeaconFinality_TimestampSelector } from '$/schema/EthereumBeaconFinality_Timestamp.ts'
import { EthereumConsensusUpgradeSelector } from '$/schema/EthereumConsensusUpgrade.ts'

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
	{ $network, upgradeId }: EntitySelector<typeof schema, EntityType.EthereumConsensusUpgrade>,
): Promise<BeaconForkScheduleEntry | undefined> => {
	const chainId = Number($network.caip2.reference)
	const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
	const consensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
		`${chainId}:${upgradeId}`
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
				[BeaconEpochSelector.EvmNetworkEpoch]: async (entitySelector) => {
				const { epoch } = entitySelector
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
				[BeaconSlotSelector.EvmNetworkSlot]: async (entitySelector) => {
				const { getHeader } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, slot } = entitySelector
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
				[BeaconValidatorSelector.EvmNetworkValidatorIndex]: async (entitySelector) => {
				const { getValidatorSummaryAtHead } = await import('$/sources/Beacon/Rest/queries.ts')
				const { $network, validatorIndex } = entitySelector
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
				[BeaconCommitteeSelector.EvmNetworkSlotIndex]: async ({ $network, slot }) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const committees = await singleFlight(getCommittees)(base, String(slot))
				const committee = committees.find((committee) => committee.index === entitySelector.index)
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
				[BeaconSyncCommitteeSelector.EvmNetworkPeriod]: async ({ $network }) => {
				const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
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
				[BeaconAttestationSelector.EvmNetworkSlotIndex]: async ({ $network, slot }) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				const attestation = summary.attestations.find((committee) => committee.index === entitySelector.index)
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
				[BeaconWithdrawalSelector.EvmNetworkSlotIndex]: async ({ $network, slot }) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				const withdrawal = summary.withdrawals.find((committee) => committee.index === entitySelector.index)
				if (withdrawal == null) throw new Error('Beacon_Rest: withdrawal not found')
				return {
					...(withdrawal.validatorIndex != null && {
						validatorIndex: withdrawal.validatorIndex,
						$validator: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								validatorIndex: withdrawal.validatorIndex,
							},
						},
					}),
					...(withdrawal.address != null && {
						$account: {
							[EntityMetaKey.Selector]: {
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
				[EthereumBeaconFinality_TimestampSelector.EvmNetworkTimestampMs]: async ({ $network }) => {
				const chainId = Number($network.caip2.reference)
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
				[BeaconEpochSelector.EvmNetworkEpoch]: async (entitySelector, context) => {
				const { $network, epoch } = entitySelector
				const limit = resolverContextRowLimit(context)
				return (
					Array.from(
						{ length: Math.min(limit, slotsPerEpoch) },
						(_, i) => (epoch * slotsPerEpoch) + i,
					)
						.map((slot) => ({
							[EntityMetaKey.Selector]: {
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
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
									[EntityMetaKey.Selector]: {
										$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
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
									[EntityMetaKey.Selector]: {
										$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getRecentProposerValidatorIndices } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
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
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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
				[BeaconSlotSelector.EvmNetworkSlot]: async ({ $network, slot }, context) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				return (
					(await singleFlight(getCommittees)(base, String(slot)))
						.slice(0, limit)
						.map((committee) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector.$network,
								slot: entitySelector.slot,
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
				[BeaconSlotSelector.EvmNetworkSlot]: async ({ $network, slot }, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.attestations.slice(0, limit).map((attestation) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						slot: entitySelector.slot,
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
				[BeaconSlotSelector.EvmNetworkSlot]: async ({ $network, slot }, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.withdrawals.slice(0, limit).map((withdrawal) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						slot: entitySelector.slot,
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
				[BeaconSlotSelector.EvmNetworkSlot]: async ({ $network, slot }, context) => {
				const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const base = requireBeaconRestBaseUrl(Number($network.caip2.reference))
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.slashings.slice(0, limit).map((slashing) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector.$network,
						slot: entitySelector.slot,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconCommittees unsupported for chain ${String(chainId)}`)
				}
				return (
					(await singleFlight(getCommittees)(base))
						.slice(0, limit)
						.map((committee) => ({
							[EntityMetaKey.Selector]: {
								$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async (entitySelector) => {
				const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const chainId = Number(entitySelector.caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSyncCommittees unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconAttestations unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.attestations.slice(0, limit).map((attestation) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconWithdrawals unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.withdrawals.slice(0, limit).map((withdrawal) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const chainId = Number(caip2.reference)
				const base = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
				if (base == null) {
					throw new Error(`Beacon_Rest: $$beaconSlashings unsupported for chain ${String(chainId)}`)
				}
				const slot = await singleFlight(getHeadSlot)(base)
				const summary = await singleFlight(getBlockDutySummary)(base, slot)
				return summary.slashings.slice(0, limit).map((slashing) => ({
					[EntityMetaKey.Selector]: {
						$network: entitySelector,
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
				[EvmNetworkSelector.Caip2]: async (entitySelector) => (
				[
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
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
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async (entitySelector) => {
				const forkScheduleEntry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entitySelector)
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
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async (entitySelector) => {
				const forkScheduleEntry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(entitySelector)
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
