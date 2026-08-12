import {
	resolverContextRowLimit,
	type ResolverSelectorPattern,
} from '$/resolvers/$resolvers.ts'
import {
	beaconConsensusByExecutionChainId,
	epochsPerSyncCommitteePeriod,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	EntitySelector,
	EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	beaconRestByChainId,
} from '$/sources/Beacon/Rest/queries.ts'
import type { BeaconBlockDutySummary } from '$/sources/Beacon/Rest/types.ts'

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

const beaconAttestationReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number,
	attestation: BeaconBlockDutySummary['attestations'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		slot,
		indexInSlot: attestation.index,
	},
	[EntityMetaKey.Fields]: {
		...(attestation.committeeIndex != null && {
			[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'committeeIndex')]: attestation.committeeIndex,
		}),
		...(attestation.aggregationBits != null && {
			[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'aggregationBits')]: attestation.aggregationBits,
		}),
	},
})

const beaconWithdrawalReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number,
	withdrawal: BeaconBlockDutySummary['withdrawals'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		slot,
		indexInSlot: withdrawal.index,
	},
	[EntityMetaKey.Fields]: {
		...(withdrawal.validatorIndex != null && {
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'validatorIndex')]: withdrawal.validatorIndex,
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$validator')]: {
				[EntityMetaKey.Selector]: {
					$network,
					indexInNetwork: withdrawal.validatorIndex,
				},
			},
		}),
		...(withdrawal.address != null && {
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$account')]: {
				[EntityMetaKey.Selector]: {
					address: with0xHex(withdrawal.address),
				},
			},
		}),
		...(withdrawal.amountGwei != null && {
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: withdrawal.amountGwei,
		}),
	},
})

const beaconSlashingReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number,
	slashing: BeaconBlockDutySummary['slashings'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		slot,
		kind: slashing.kind,
		indexInSlot: slashing.index,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconSlashing, [], '$network')]: {
			[EntityMetaKey.Selector]: $network,
		},
		[entityFieldAddressKey(EntityType.BeaconSlashing, [], 'slot')]: slot,
		[entityFieldAddressKey(EntityType.BeaconSlashing, [], 'kind')]: slashing.kind,
		[entityFieldAddressKey(EntityType.BeaconSlashing, [], 'indexInSlot')]: slashing.index,
	},
})

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

const optionalSafeIntegerEpoch = (
	value: string
) => {
	const number = Number(value)
	return Number.isSafeInteger(number) ? number : undefined
}

const mapBeaconValidatorObservation = (
	envelope: NonNullable<
		Awaited<
			ReturnType<
				typeof import('$/sources/Beacon/Rest/queries.ts').getValidator
			>
		>
	>
) => {
	const { validator } = envelope
	const activationEligibilityEpoch = optionalSafeIntegerEpoch(validator.validator.activation_eligibility_epoch)
	const activationEpoch = optionalSafeIntegerEpoch(validator.validator.activation_epoch)
	const exitEpoch = optionalSafeIntegerEpoch(validator.validator.exit_epoch)
	const withdrawableEpoch = optionalSafeIntegerEpoch(validator.validator.withdrawable_epoch)
	return {
		balanceGwei: BigInt(validator.balance),
		effectiveBalanceGwei: BigInt(validator.validator.effective_balance),
		status: validator.status,
		slashed: validator.validator.slashed,
		...(activationEligibilityEpoch != null && { activationEligibilityEpoch }),
		...(activationEpoch != null && { activationEpoch }),
		...(exitEpoch != null && { exitEpoch }),
		...(withdrawableEpoch != null && { withdrawableEpoch }),
		withdrawalCredentials: with0xHex(validator.validator.withdrawal_credentials),
		finalized: envelope.finalized,
		executionOptimistic: envelope.executionOptimistic,
	}
}

const observationFields = (
	observation: ReturnType<typeof mapBeaconValidatorObservation>
) => (
	Object.fromEntries(
		Object.entries(observation).map(([field, value]) => [
			entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], field),
			value,
		])
	)
)

const mapBeaconValidatorSnapshot = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	indexOrPubkey: number | string
) => {
	const { getHeadSlot, getValidator } = await import('$/sources/Beacon/Rest/queries.ts')
	const chainId = eip155ChainId($network)
	const observationSlot = safeIntegerFromDecimal(
		await getHeadSlot(chainId),
		'head slot'
	)
	const envelope = await getValidator(
		chainId,
		indexOrPubkey,
		observationSlot
	)
	if (envelope == null) {
		throw new Error(
			typeof indexOrPubkey === 'number' ?
				`Beacon_Rest: validator not returned for index ${String(indexOrPubkey)}`
			:
				`Beacon_Rest: validator not returned for pubkey ${indexOrPubkey}`
		)
	}
	const observation = mapBeaconValidatorObservation(envelope)
	const validatorSelector = {
		$network,
		indexInNetwork: safeIntegerFromDecimal(
			envelope.validator.index,
			'validator index'
		),
	}
	return {
		indexInNetwork: validatorSelector.indexInNetwork,
		pubkey: with0xHex(envelope.validator.validator.pubkey),
		...observation,
		timestamps: [{
			[EntityMetaKey.Selector]: {
				$validator: validatorSelector,
				slot: observationSlot,
				source: Source.Beacon_Rest,
			},
			[EntityMetaKey.Fields]: observationFields(observation),
		}],
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
						const chainId = Number(caip2.reference)
						const {
							getNodeHealthObservation,
							getNodeIdentityObservation,
							getNodePeerCountObservation,
							getNodeSyncingObservation,
							getNodeVersionObservation,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const [
							health,
							identity,
							peerCount,
							syncing,
							version,
						] = await Promise.all([
							getNodeHealthObservation(chainId),
							getNodeIdentityObservation(chainId),
							getNodePeerCountObservation(chainId),
							getNodeSyncingObservation(chainId),
							getNodeVersionObservation(chainId),
						])
						if (![
							health.endpointUrl,
							identity.endpointUrl,
							syncing.endpointUrl,
							version.endpointUrl,
						].every((endpointUrl) => endpointUrl === peerCount.endpointUrl))
							throw new Error('Beacon_Rest: node observation endpoints do not match')

						return [{
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								endpointUrl: peerCount.endpointUrl,
								endpointKind: ApiFamily.EthereumBeaconRest,
								timestampMs: Math.max(
									health.fetchedAtMs,
									identity.fetchedAtMs,
									peerCount.fetchedAtMs,
									syncing.fetchedAtMs,
									version.fetchedAtMs
								),
								source: Source.Beacon_Rest,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'disconnectedPeerCount')]: BigInt(peerCount.disconnected),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'connectingPeerCount')]: BigInt(peerCount.connecting),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'connectedPeerCount')]: BigInt(peerCount.connected),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'disconnectingPeerCount')]: BigInt(peerCount.disconnecting),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'headSlot')]: BigInt(syncing.head_slot),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'syncDistance')]: BigInt(syncing.sync_distance),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'isSyncing')]: syncing.is_syncing,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'isOptimistic')]: syncing.is_optimistic,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'executionLayerOffline')]: syncing.el_offline,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'version')]: version.version,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'peerId')]: identity.peer_id,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'enr')]: identity.enr,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'p2pAddresses')]: identity.p2p_addresses,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'discoveryAddresses')]: identity.discovery_addresses,
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'metadataSequenceNumber')]: BigInt(identity.metadata.seq_number),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'attestationSubnets')]: identity.metadata.attnets,
								...(identity.metadata.syncnets != null && {
									[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'syncCommitteeSubnets')]: identity.metadata.syncnets,
								}),
								...(identity.metadata.custody_group_count != null && {
									[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'custodyGroupCount')]: BigInt(identity.metadata.custody_group_count),
								}),
								[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'statusCode')]: health.statusCode,
							},
						}]
					},
				},
			},
		})({
			$$endpointObservations: (network) => network,
		}),

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
					resolve: async ({ $network, indexInNetwork }) => (
						mapBeaconValidatorSnapshot(
							$network,
							indexInNetwork
						)
					),
				},
				NetworkPubkey: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, pubkey }) => (
						mapBeaconValidatorSnapshot(
							$network,
							pubkey
						)
					),
				},
			},
		})({
				indexInNetwork: (validator) => validator.indexInNetwork,
				balanceGwei: (validator) => validator.balanceGwei,
				effectiveBalanceGwei: (validator) => validator.effectiveBalanceGwei,
				pubkey: (validator) => validator.pubkey,
				slashed: (validator) => validator.slashed,
				status: (validator) => validator.status,
				$$timestamps: (validator) => validator.timestamps,
			}),

		defineResolver({
			entityType: EntityType.BeaconValidator_Timestamp,
			resolve: {
				ValidatorSlotSource: {
					resolve: async ({
						$validator,
						slot,
						source,
					}) => {
						if (source !== Source.Beacon_Rest)
							throw new Error(`Beacon_Rest: unsupported source ${source}`)

						const indexOrPubkey = (
							'indexInNetwork' in $validator ?
								$validator.indexInNetwork
							:
								$validator.pubkey
						)
						const snapshot = await mapBeaconValidatorSnapshot(
							$validator.$network,
							indexOrPubkey
						)
						const observation = snapshot.timestamps[0]
						if (observation == null)
							throw new Error('Beacon_Rest: missing validator observation')
						if (observation[EntityMetaKey.Selector].slot !== slot)
							throw new Error(`Beacon_Rest: no validator observation at slot ${String(slot)}`)

						return {
							$validator: {
								[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector].$validator,
							},
							slot,
							source,
							balanceGwei: snapshot.balanceGwei,
							effectiveBalanceGwei: snapshot.effectiveBalanceGwei,
							status: snapshot.status,
							slashed: snapshot.slashed,
							...(snapshot.activationEligibilityEpoch != null && {
								activationEligibilityEpoch: snapshot.activationEligibilityEpoch,
							}),
							...(snapshot.activationEpoch != null && {
								activationEpoch: snapshot.activationEpoch,
							}),
							...(snapshot.exitEpoch != null && {
								exitEpoch: snapshot.exitEpoch,
							}),
							...(snapshot.withdrawableEpoch != null && {
								withdrawableEpoch: snapshot.withdrawableEpoch,
							}),
							withdrawalCredentials: snapshot.withdrawalCredentials,
							finalized: snapshot.finalized,
							executionOptimistic: snapshot.executionOptimistic,
						}
					},
				},
			},
		})({
				$validator: (observation) => observation.$validator,
				slot: (observation) => observation.slot,
				source: (observation) => observation.source,
				balanceGwei: (observation) => observation.balanceGwei,
				effectiveBalanceGwei: (observation) => observation.effectiveBalanceGwei,
				status: (observation) => observation.status,
				slashed: (observation) => observation.slashed,
				activationEligibilityEpoch: (observation) => observation.activationEligibilityEpoch,
				activationEpoch: (observation) => observation.activationEpoch,
				exitEpoch: (observation) => observation.exitEpoch,
				withdrawableEpoch: (observation) => observation.withdrawableEpoch,
				withdrawalCredentials: (observation) => observation.withdrawalCredentials,
				finalized: (observation) => observation.finalized,
				executionOptimistic: (observation) => observation.executionOptimistic,
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
					resolve: async ({ $network, period }) => {
						const { getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
						const committee = await getSyncCommittee(
							eip155ChainId($network),
							period * epochsPerSyncCommitteePeriod * slotsPerEpoch
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
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BeaconCommittee, [], 'validatorIndices')]: committee.validators.map(Number),
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
								.map((attestation) => beaconAttestationReference(
									$network,
									slot,
									attestation
								)),
							withdrawals: summary.withdrawals
								.slice(0, limit)
								.map((withdrawal) => beaconWithdrawalReference(
									$network,
									slot,
									withdrawal
								)),
							slashings: summary.slashings
								.slice(0, limit)
								.map((slashing) => beaconSlashingReference(
									$network,
									slot,
									slashing
								)),
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
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BeaconCommittee, [], 'validatorIndices')]: committee.validators.map(Number),
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
					resolve: async ({ caip2 }, context) => {
						const { getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headPeriod = Math.floor(
							Math.floor(
								safeIntegerFromDecimal(
									await getHeadSlot(chainId),
									'head slot'
								) / slotsPerEpoch
							) / epochsPerSyncCommitteePeriod
						)
						return (
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => headPeriod - i
							)
								.flatMap((period) => (
									period < 0 ?
										[]
									:
										[
											{
												[EntityMetaKey.Selector]: {
													$network: { caip2 },
													period,
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
								.map((attestation) => beaconAttestationReference(
									{ caip2 },
									slot,
									attestation
								)),
							withdrawals: summary.withdrawals
								.slice(0, limit)
								.map((withdrawal) => beaconWithdrawalReference(
									{ caip2 },
									slot,
									withdrawal
								)),
							slashings: summary.slashings
								.slice(0, limit)
								.map((slashing) => beaconSlashingReference(
									{ caip2 },
									slot,
									slashing
								)),
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
