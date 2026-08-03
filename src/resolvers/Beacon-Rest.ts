import {
	resolverContextRowLimit,
	type ResolverSelectorPattern,
} from '$/resolvers/$resolvers.ts'
import {
	beaconConsensusByExecutionChainId,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	EntitySelector,
	EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import {
	beaconRestByChainId,
} from '$/sources/Beacon/Rest/queries.ts'

const beaconNetworkApplicability = [...beaconRestByChainId.values()].map(({ chainId }) => ({
	caip2: {
		namespace: 'eip155',
		reference: chainId,
	},
}))

const eip155NetworkApplicability = [{
	$network: {
		caip2: {
			namespace: 'eip155',
		},
	},
}] as const satisfies readonly [
	ResolverSelectorPattern<EntitySelectorForSelectorName<
		typeof schema,
		EntityType.BeaconSlot,
		'EvmNetworkSlot'
	>>,
]

const eip155ChainId = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (!('caip2' in network) || network.caip2.namespace !== 'eip155')
		throw new Error('Beacon_Rest: network must use the eip155 CAIP-2 namespace')

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error('Beacon_Rest: network must have a positive safe eip155 chain ID')
	return chainId
}

const safeIntegerFromDecimal = (
	value: string,
	description: string
) => {
	const number = Number(value)
	if (!Number.isSafeInteger(number))
		throw new Error(`Beacon_Rest: ${description} must be a safe integer`)
	return number
}

const beaconForkScheduleEntryForNetworkConsensusUpgrade = async (
	selector: EntitySelector<typeof schema, EntityType.EthereumConsensusUpgrade>
) => {
	const chainId = eip155ChainId(selector.$network)
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
	if (activationEpoch == null)
		return undefined

	const { getForkSchedule } = await import('$/sources/Beacon/Rest/queries.ts')
	const schedule = await getForkSchedule(chainId)
	return schedule.find((forkScheduleEntry) => (
		Number.parseInt(forkScheduleEntry.epoch, 10) === activationEpoch
	))
}

const beaconForkVersionsForNetworkConsensusUpgrade = async (
	selector: EntitySelector<typeof schema, EntityType.EthereumConsensusUpgrade>
) => {
	const entry = await beaconForkScheduleEntryForNetworkConsensusUpgrade(selector)
	return {
		previousForkVersion: entry == null ? undefined : with0xHex(entry.previous_version),
		currentForkVersion: entry == null ? undefined : with0xHex(entry.current_version),
	}
}

export default {
	source: Source.Beacon_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: beaconNetworkApplicability,
					resolve: async ({ caip2 }) => {
						const consensus = beaconConsensusByExecutionChainId[Number(caip2.reference)]
						if (consensus == null)
							return []

						return (beaconRestByChainId.get(Number(caip2.reference))?.restBaseUrls ?? []).map((restBaseUrl) => ({
							restBaseUrl,
							consensusProtocol: consensus.consensusProtocol,
						}))
					},
				},
			},
		})({
			Evm: {
				consensusEndpoints: (network) => network,
			},
		}),

		defineResolver({
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

		defineResolver({
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

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }) => {
						const { getHeader } = await import('$/sources/Beacon/Rest/queries.ts')
						const header = await getHeader(
							eip155ChainId($network),
							slot
						)
						return {
							bodyRoot: with0xHex(header.header.message.body_root),
							canonical: header.canonical,
							parentRoot: with0xHex(header.header.message.parent_root),
							proposerIndex: safeIntegerFromDecimal(
								header.header.message.proposer_index,
								'proposer index'
							),
							root: with0xHex(header.root),
							signature: with0xHex(header.header.signature),
							stateRoot: with0xHex(header.header.message.state_root),
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

		defineResolver({
			entityType: EntityType.BeaconValidator,
			resolve: {
				NetworkIndexInNetwork: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, indexInNetwork }) => {
						const { getValidatorAtHead } = await import('$/sources/Beacon/Rest/queries.ts')
						const validator = await getValidatorAtHead(
							eip155ChainId($network),
							indexInNetwork
						)
						if (validator == null) {
							throw new Error(
								`Beacon_Rest: validator not returned for index ${String(indexInNetwork)}`
							)
						}
						return {
							balanceGwei: BigInt(validator.balance),
							effectiveBalanceGwei: BigInt(validator.validator.effective_balance),
							pubkey: with0xHex(validator.validator.pubkey),
							slashed: validator.validator.slashed,
							status: validator.status,
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

		defineResolver({
			entityType: EntityType.BeaconCommittee,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						const committee = (
							await getCommittees(
								eip155ChainId($network),
								String(slot)
							)
						).find((committee) => Number(committee.index) === indexInSlot)
						if (committee == null) throw new Error('Beacon_Rest: committee not found')
						return {
							validatorIndices: committee.validators.map(Number),
						}
					},
				},
			},
		})({
				validatorIndices: (committee) => committee.validatorIndices,
			}),

		defineResolver({
			entityType: EntityType.BeaconSyncCommittee,
			resolve: {
				EvmNetworkPeriod: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network }) => {
						const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
						const committee = await getSyncCommittee(
							eip155ChainId($network),
							'head'
						)
						if (committee == null) throw new Error('Beacon_Rest: sync committee not found')
						return {
							validatorIndices: committee.validators.map(Number),
						}
					},
				},
			},
		})({
				validatorIndices: (committee) => committee.validatorIndices,
			}),

		defineResolver({
			entityType: EntityType.BeaconAttestation,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const attestation = (
							await getBlockDutySummary(
								eip155ChainId($network),
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

		defineResolver({
			entityType: EntityType.BeaconWithdrawal,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const withdrawal = (
							await getBlockDutySummary(
								eip155ChainId($network),
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

		defineResolver({
			entityType: EntityType.BeaconSlashing,
			resolve: {
				EvmNetworkSlotKindIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, kind, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const slashing = (
							await getBlockDutySummary(
								eip155ChainId($network),
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
				$network: (slashing) => ({
					[EntityMetaKey.Selector]: slashing.$network,
				}),
				slot: (slashing) => slashing.slot,
				kind: (slashing) => slashing.kind,
				indexInSlot: (slashing) => slashing.indexInSlot,
			}),

		defineResolver({
			entityType: EntityType.EthereumBeaconFinality_Timestamp,
			resolve: {
				EvmNetworkTimestampMs: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network }) => {
						const chainId = eip155ChainId($network)
						const { getFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
						const checkpoints = await getFinalityCheckpoints(chainId)
						if (checkpoints == null) {
							throw new Error(
								`Beacon_Rest: finality checkpoints not returned for chain ${String(chainId)}`
							)
						}
						return {
							currentJustifiedCheckpointEpoch: Number.parseInt(checkpoints.current_justified.epoch, 10),
							currentJustifiedCheckpointRoot: with0xHex(checkpoints.current_justified.root),
							previousJustifiedCheckpointEpoch: Number.parseInt(checkpoints.previous_justified.epoch, 10),
							previousJustifiedCheckpointRoot: with0xHex(checkpoints.previous_justified.root),
							finalizedCheckpointEpoch: Number.parseInt(checkpoints.finalized.epoch, 10),
							finalizedCheckpointRoot: with0xHex(checkpoints.finalized.root),
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

		defineResolver({
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headEpoch = Math.floor(
							safeIntegerFromDecimal(
								await getHeadSlot(chainId),
								'head slot'
							) / slotsPerEpoch
						)
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headSlot = safeIntegerFromDecimal(
							await getHeadSlot(chainId),
							'head slot'
						)
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

		defineResolver({
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
										indexInNetwork: safeIntegerFromDecimal(
											validatorIndex,
											'proposer index'
										),
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

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						return (
							(await getCommittees(
								eip155ChainId($network),
								String(slot)
							))
								.slice(0, resolverContextRowLimit(context))
								.map((committee) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: Number(committee.index),
									},
								}))
						)
					},
				},
			},
		})({
				$$beaconCommittees: (slot) => slot,
			}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const summary = await getBlockDutySummary(
							eip155ChainId($network),
							slot
						)
						const limit = resolverContextRowLimit(context)
						return {
							attestations: summary.attestations
								.slice(0, limit)
								.map((attestation) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: attestation.index,
									},
								})),
							withdrawals: summary.withdrawals
								.slice(0, limit)
								.map((withdrawal) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: withdrawal.index,
									},
								})),
							slashings: summary.slashings
								.slice(0, limit)
								.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										kind: slashing.kind,
										indexInSlot: slashing.index,
									},
								})),
						}
					},
				},
			},
		})({
				$$beaconAttestations: (slot) => slot.attestations,
				$$beaconWithdrawals: (slot) => slot.withdrawals,
				$$beaconSlashings: (slot) => slot.slashings,
			}),

		defineResolver({
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
										slot: Number(committee.slot),
										indexInSlot: Number(committee.index),
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

		defineResolver({
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
									period: Math.floor(
										Math.floor(
											safeIntegerFromDecimal(
												await getHeadSlot(chainId),
												'head slot'
											) / slotsPerEpoch
										) / 256
									),
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getBlockDutySummary, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const slot = safeIntegerFromDecimal(
							await getHeadSlot(chainId),
							'head slot'
						)
						const summary = await getBlockDutySummary(chainId, slot)
						const limit = resolverContextRowLimit(context)
						return {
							attestations: summary.attestations
								.slice(0, limit)
								.map((attestation) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										indexInSlot: attestation.index,
									},
								})),
							withdrawals: summary.withdrawals
								.slice(0, limit)
								.map((withdrawal) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										indexInSlot: withdrawal.index,
									},
								})),
							slashings: summary.slashings
								.slice(0, limit)
								.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network: { caip2 },
										slot,
										kind: slashing.kind,
										indexInSlot: slashing.index,
									},
								})),
						}
					},
				},
			},
		})({
				Evm: {
					$$beaconAttestations: (network) => network.attestations,
					$$beaconWithdrawals: (network) => network.withdrawals,
					$$beaconSlashings: (network) => network.slashings,
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						if (!beaconRestByChainId.has(Number(caip2.reference)))
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

		defineResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				EvmNetworkUpgradeId: {
					appliesTo: eip155NetworkApplicability,
					resolve: (selector) => (
						beaconForkVersionsForNetworkConsensusUpgrade(selector)
					),
				},
				EvmNetworkSlug: {
					appliesTo: eip155NetworkApplicability,
					resolve: (selector) => (
						beaconForkVersionsForNetworkConsensusUpgrade(selector)
					),
				},
			},
		})({
				previousForkVersion: (upgrade) => upgrade.previousForkVersion,
				currentForkVersion: (upgrade) => upgrade.currentForkVersion,
			}),
	],
} satisfies RegisteredSourceResolverModule
