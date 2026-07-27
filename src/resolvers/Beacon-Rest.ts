import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
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

const beaconFinalityCheckpointsForChain = async (
	chainId: number
): Promise<BeaconFinalityCheckpoints | undefined> => {
	const { getFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
	return getFinalityCheckpoints(chainId)
}

const beaconForkScheduleEntryForNetworkConsensusUpgrade = async (
	selector: EntitySelector<typeof schema, EntityType.EthereumConsensusUpgrade>
): Promise<BeaconForkScheduleEntry | undefined> => {
	const chainId = Number(selector.$network.caip2.reference)
	const {
		networkConsensusUpgrades,
	} = await import('$/constants/EthereumNetworkUpgrades.ts')
	const segment = 'upgradeId' in selector ? selector.upgradeId : selector.slug
	const consensusUpgrade = networkConsensusUpgrades.find((candidate) => (
		candidate.chainId === chainId
		&& [
			candidate.upgradeId,
			candidate.slug,
			candidate.upgradeId.toLowerCase(),
			candidate.slug.toLowerCase(),
		].includes(segment)
	))
	if (consensusUpgrade == null)
		throw new Error(`Beacon_Rest: consensus upgrade not found for chain ${String(chainId)}`)
	const activationEpoch = consensusUpgrade.activationEpoch
	if (activationEpoch == null) {
		return undefined
	}
	const { getForkSchedule } = await import('$/sources/Beacon/Rest/queries.ts')
	const schedule = await getForkSchedule(chainId)
	return schedule.find((forkScheduleEntry) => forkScheduleEntry.epoch === activationEpoch)
}

export default {
	source: Source.Beacon_Rest,

	resolvers: [
		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					resolve: async ({ epoch }) => ({
						startSlot: epoch * slotsPerEpoch,
						endSlot: (epoch * slotsPerEpoch) + slotsPerEpoch - 1,
						slotCount: slotsPerEpoch,
					}),
				},
			},
		})({
				startSlot: (epoch) => epoch.startSlot,
				endSlot: (epoch) => epoch.endSlot,
				slotCount: (epoch) => epoch.slotCount,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ slot }) => ({
						epoch: Math.floor(slot / slotsPerEpoch),
					}),
				},
			},
		})({
				epoch: (slot) => slot.epoch,
				$epoch: (slot, { $network }) => ({
					[EntityMetaKey.Selector]: {
						$network,
						epoch: slot.epoch,
					},
				}),
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ $network, slot }) => {
						const { getHeader } = await import('$/sources/Beacon/Rest/queries.ts')
						const header = await getHeader(
							Number($network.caip2.reference),
							slot
						)
						return {
							bodyRoot: with0xHex(header.bodyRoot),
							...(header.canonical != null && { canonical: header.canonical }),
							parentRoot: with0xHex(header.parentRoot),
							proposerIndex: header.proposerIndex,
							root: with0xHex(header.root),
							signature: with0xHex(header.signature),
							stateRoot: with0xHex(header.stateRoot),
						}
					},
				},
			},
		})({
				bodyRoot: (slot) => slot.bodyRoot,
				canonical: (slot) => slot.canonical,
				parentRoot: (slot) => slot.parentRoot,
				proposerIndex: (slot) => slot.proposerIndex,
				root: (slot) => slot.root,
				signature: (slot) => slot.signature,
				stateRoot: (slot) => slot.stateRoot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconValidator,
			resolve: {
				NetworkIndexInNetwork: {
					resolve: async ({ $network, indexInNetwork }) => {
						const { getValidatorSummaryAtHead } = await import('$/sources/Beacon/Rest/queries.ts')
						const summary = await getValidatorSummaryAtHead(
							Number($network.caip2.reference),
							indexInNetwork
						)
						if (summary == null) {
							throw new Error(
								`Beacon_Rest: validator summary not returned for index ${String(indexInNetwork)}`
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
				},
			},
		})({
				balanceGwei: (validator) => validator.balanceGwei,
				effectiveBalanceGwei: (validator) => validator.effectiveBalanceGwei,
				pubkey: (validator) => validator.pubkey,
				slashed: (validator) => validator.slashed,
				status: (validator) => validator.status,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconCommittee,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						const committee = (
							await getCommittees(
								Number($network.caip2.reference),
								String(slot)
							)
						).find((committee) => committee.index === indexInSlot)
						if (committee == null) throw new Error('Beacon_Rest: committee not found')
						return {
							validatorIndices: committee.validatorIndices,
						}
					},
				},
			},
		})({
				validatorIndices: (committee) => committee.validatorIndices,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSyncCommittee,
			resolve: {
				EvmNetworkPeriod: {
					resolve: async ({ $network }) => {
						const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
						const committee = await getSyncCommittee(
							Number($network.caip2.reference),
							'head'
						)
						if (committee == null) throw new Error('Beacon_Rest: sync committee not found')
						return {
							validatorIndices: committee.validatorIndices,
						}
					},
				},
			},
		})({
				validatorIndices: (committee) => committee.validatorIndices,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconAttestation,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const attestation = (
							await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)
						).attestations.find((committee) => committee.index === indexInSlot)
						if (attestation == null) throw new Error('Beacon_Rest: attestation not found')
						return {
							...(attestation.committeeIndex != null && { committeeIndex: attestation.committeeIndex }),
							...(attestation.aggregationBits != null && { aggregationBits: attestation.aggregationBits }),
						}
					},
				},
			},
		})({
				committeeIndex: (attestation) => attestation.committeeIndex,
				aggregationBits: (attestation) => attestation.aggregationBits,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconWithdrawal,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const withdrawal = (
							await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)
						).withdrawals.find((committee) => committee.index === indexInSlot)
						if (withdrawal == null) throw new Error('Beacon_Rest: withdrawal not found')
						return {
							...(withdrawal.validatorIndex != null && {
								validatorIndex: withdrawal.validatorIndex,
								$validator: {
									[EntityMetaKey.Selector]: {
										$network,
										indexInNetwork: withdrawal.validatorIndex,
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
					},
				},
			},
		})({
				validatorIndex: (withdrawal) => withdrawal.validatorIndex,
				$validator: (withdrawal) => withdrawal.$validator,
				$account: (withdrawal) => withdrawal.$account,
				amountGwei: (withdrawal) => withdrawal.amountGwei,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlashing,
			resolve: {
				EvmNetworkSlotKindIndexInSlot: {
					resolve: async ({ $network, slot, kind, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const slashing = (
							await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)
						).slashings.find((candidate) => (
							candidate.kind === kind
							&& candidate.index === indexInSlot
						))
						if (slashing == null) throw new Error('Beacon_Rest: slashing not found')
						return {
							$network,
							slot,
							kind: slashing.kind,
							indexInSlot: slashing.index,
						}
					},
				},
			},
		})({
				$network: (slashing) => slashing.$network,
				slot: (slashing) => slashing.slot,
				kind: (slashing) => slashing.kind,
				indexInSlot: (slashing) => slashing.indexInSlot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumBeaconFinality_Timestamp,
			resolve: {
				EvmNetworkTimestampMs: {
					resolve: async ({ $network }) => {
						const chainId = Number($network.caip2.reference)
						const checkpoints = await beaconFinalityCheckpointsForChain(chainId)
						if (checkpoints == null) {
							throw new Error(
								`Beacon_Rest: finality checkpoints not returned for chain ${String(chainId)}`
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
				},
			},
		})({
				currentJustifiedCheckpointEpoch: (timestamp) => timestamp.currentJustifiedCheckpointEpoch,
				currentJustifiedCheckpointRoot: (timestamp) => timestamp.currentJustifiedCheckpointRoot,
				previousJustifiedCheckpointEpoch: (timestamp) => timestamp.previousJustifiedCheckpointEpoch,
				previousJustifiedCheckpointRoot: (timestamp) => timestamp.previousJustifiedCheckpointRoot,
				finalizedCheckpointEpoch: (timestamp) => timestamp.finalizedCheckpointEpoch,
				finalizedCheckpointRoot: (timestamp) => timestamp.finalizedCheckpointRoot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					resolve: async ({ $network, epoch }, context) => (
						Array.from(
							{ length: Math.min(resolverContextRowLimit(context), slotsPerEpoch) },
							(_, i) => (epoch * slotsPerEpoch) + i
						)
							.map((slot) => ({
								[EntityMetaKey.Selector]: {
									$network,
									slot,
								},
							}))
					),
				},
			},
		})({
				$$beaconSlots: (epoch) => epoch,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headEpoch = Math.floor(await getHeadSlot(chainId) / slotsPerEpoch)
						return (
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => headEpoch - i
							)
								.flatMap((epoch) => (
									epoch < 0 ?
										[]
									:
										[
											{
												[EntityMetaKey.Selector]: {
													$network: { caip2 },
													epoch,
												},
											},
										]
								))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconEpochs: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headSlot = await getHeadSlot(chainId)
						return (
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => headSlot - i
							)
								.flatMap((slot) => (
									slot < 0 ?
										[]
									:
										[
											{
												[EntityMetaKey.Selector]: {
													$network: { caip2 },
													slot,
												},
											},
										]
								))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconSlots: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getRecentProposerValidatorIndices } = await import('$/sources/Beacon/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const chainId = Number(caip2.reference)
						return (
							(await getRecentProposerValidatorIndices({
								chainId,
								limit,
								slotLookbackCap: Math.min(384, Math.max(limit * 8, slotsPerEpoch)),
							}))
								.map((validatorIndex) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										indexInNetwork: validatorIndex,
									},
								}))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconValidators: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ $network, slot }, context) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						return (
							(await getCommittees(
								Number($network.caip2.reference),
								String(slot)
							))
								.slice(0, resolverContextRowLimit(context))
								.map((committee) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: committee.index,
									},
								}))
						)
					},
				},
			},
		})({
				$$beaconCommittees: (slot) => slot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ $network, slot }, context) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						return (
							(await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)).attestations
								.slice(0, resolverContextRowLimit(context))
								.map((attestation) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: attestation.index,
									},
								}))
						)
					},
				},
			},
		})({
				$$beaconAttestations: (slot) => slot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ $network, slot }, context) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						return (
							(await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)).withdrawals
								.slice(0, resolverContextRowLimit(context))
								.map((withdrawal) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: withdrawal.index,
									},
								}))
						)
					},
				},
			},
		})({
				$$beaconWithdrawals: (slot) => slot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					resolve: async ({ $network, slot }, context) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						return (
							(await getBlockDutySummary(
								Number($network.caip2.reference),
								slot
							)).slashings
								.slice(0, resolverContextRowLimit(context))
								.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										kind: slashing.kind,
										indexInSlot: slashing.index,
									},
								}))
						)
					},
				},
			},
		})({
				$$beaconSlashings: (slot) => slot,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						return (
							(await getCommittees(chainId))
								.slice(0, resolverContextRowLimit(context))
								.map((committee) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot: committee.slot,
										indexInSlot: committee.index,
									},
								}))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconCommittees: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: { caip2 },
									period: Math.floor(Math.floor(await getHeadSlot(chainId) / slotsPerEpoch) / 256),
								},
							},
						]
					},
				},
			},
		})({
				Evm: {
					$$beaconSyncCommittees: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const slot = await getHeadSlot(chainId)
						return (
							(await getBlockDutySummary(chainId, slot)).attestations
								.slice(0, resolverContextRowLimit(context))
								.map((attestation) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										indexInSlot: attestation.index,
									},
								}))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconAttestations: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const slot = await getHeadSlot(chainId)
						return (
							(await getBlockDutySummary(chainId, slot)).withdrawals
								.slice(0, resolverContextRowLimit(context))
								.map((withdrawal) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										indexInSlot: withdrawal.index,
									},
								}))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconWithdrawals: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const slot = await getHeadSlot(chainId)
						return (
							(await getBlockDutySummary(chainId, slot)).slashings
								.slice(0, resolverContextRowLimit(context))
								.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										kind: slashing.kind,
										indexInSlot: slashing.index,
									},
								}))
						)
					},
				},
			},
		})({
				Evm: {
					$$beaconSlashings: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { beaconRestBinding } = await import('$/sources/Beacon/Rest/queries.ts')
						if (beaconRestBinding(Number(caip2.reference)) == null)
							return []

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: { caip2 },
									timestampMs: Date.now(),
								},
							},
						]
					},
				},
			},
		})({
				Evm: {
					$$beaconFinalityTimestamps: (network) => network,
				},
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					resolve: async (selector) => (
						(await beaconForkScheduleEntryForNetworkConsensusUpgrade(selector))?.previousVersion
					),
				},
				EvmNetworkSlug: {
					resolve: async (selector) => (
						(await beaconForkScheduleEntryForNetworkConsensusUpgrade(selector))?.previousVersion
					),
				},
			},
		})({
				previousForkVersion: (upgrade) => upgrade,
			}),

		defineResolver(Source.Beacon_Rest, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					resolve: async (selector) => (
						(await beaconForkScheduleEntryForNetworkConsensusUpgrade(selector))?.currentVersion
					),
				},
				EvmNetworkSlug: {
					resolve: async (selector) => (
						(await beaconForkScheduleEntryForNetworkConsensusUpgrade(selector))?.currentVersion
					),
				},
			},
		})({
				currentForkVersion: (upgrade) => upgrade,
			}),
	],
}
