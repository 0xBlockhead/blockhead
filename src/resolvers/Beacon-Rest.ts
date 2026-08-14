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
import type {
	BeaconBlockSnapshot,
	BeaconBlockDutySummary,
	BeaconDataColumnSidecars,
	BeaconExecutionPayloadEnvelope,
} from '$/sources/Beacon/Rest/types.ts'

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

const assertExecutionPayloadEnvelopeMatchesBlock = (
	block: BeaconBlockSnapshot,
	envelope: BeaconExecutionPayloadEnvelope
) => {
	if (
		block.executionPayloadBid == null
		|| envelope.beaconBlockRoot.toLowerCase() !== block.root.toLowerCase()
		|| envelope.parentBeaconBlockRoot.toLowerCase() !== block.parentRoot.toLowerCase()
		|| envelope.builderIndex !== block.executionPayloadBid.builderIndex
		|| envelope.executionBlockHash.toLowerCase() !== block.executionPayloadBid.executionBlockHash.toLowerCase()
		|| envelope.parentExecutionBlockHash.toLowerCase() !== block.executionPayloadBid.parentExecutionBlockHash.toLowerCase()
		|| envelope.slotNumber !== block.slot
	) throw new Error('Beacon_Rest: execution payload envelope does not match selected block bid')
}

const beaconDataColumnSnapshot = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number,
	sidecars: BeaconDataColumnSidecars & { endpointUrl: string },
	sidecar: BeaconDataColumnSidecars['sidecars'][number],
	timestampMs: number
) => {
	if (sidecar.slot !== slot)
		throw new Error(`Beacon_Rest: data column slot ${String(sidecar.slot)} does not match requested slot ${String(slot)}`)

	const $slot = {
		$network,
		slot,
	}
	const $dataColumn = {
		$slot,
		columnIndex: sidecar.index,
	}
	return {
		$slot: {
			[EntityMetaKey.Selector]: $slot,
		},
		columnIndex: sidecar.index,
		forkVersion: sidecars.version,
		columnCount: sidecar.columns.length,
		columns: sidecar.columns,
		kzgProofs: sidecar.kzgProofs,
		kzgCommitments: sidecar.kzgCommitments,
		...(sidecar.beaconBlockRoot != null && {
			beaconBlockRoot: sidecar.beaconBlockRoot,
		}),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$dataColumn,
				timestampMs,
				source: Source.Beacon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconDataColumn_Timestamp, [], 'endpointUrl')]: sidecars.endpointUrl,
				[entityFieldAddressKey(EntityType.BeaconDataColumn_Timestamp, [], 'executionOptimistic')]: sidecars.executionOptimistic,
				[entityFieldAddressKey(EntityType.BeaconDataColumn_Timestamp, [], 'finalized')]: sidecars.finalized,
			},
		}],
	}
}

const beaconDataColumnReference = (
	snapshot: ReturnType<typeof beaconDataColumnSnapshot>
) => ({
	[EntityMetaKey.Selector]: {
		$slot: snapshot.$slot[EntityMetaKey.Selector],
		columnIndex: snapshot.columnIndex,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], '$slot')]: snapshot.$slot,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'forkVersion')]: snapshot.forkVersion,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'columnCount')]: snapshot.columnCount,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'columns')]: snapshot.columns,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'kzgProofs')]: snapshot.kzgProofs,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'kzgCommitments')]: snapshot.kzgCommitments,
		...(snapshot.beaconBlockRoot != null && {
			[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'beaconBlockRoot')]: snapshot.beaconBlockRoot,
		}),
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], '$$timestamps')]: snapshot.$$timestamps,
	},
})

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

const beaconDepositReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number,
	deposit: BeaconBlockDutySummary['deposits'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		slot,
		indexInSlot: deposit.index,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'pubkey')]: deposit.pubkey,
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], '$validator')]: {
			[EntityMetaKey.Selector]: {
				$network,
				pubkey: deposit.pubkey,
			},
		},
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'withdrawalCredentials')]: deposit.withdrawalCredentials,
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'amountGwei')]: deposit.amountGwei,
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'signature')]: deposit.signature,
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'proof')]: deposit.proof,
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

const beaconSlotReferenceFromHeader = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	header: Awaited<ReturnType<typeof import('$/sources/Beacon/Rest/queries.ts').getHeader>>
) => {
	const slot = safeIntegerFromDecimal(header.header.message.slot, 'slot')
	return {
		[EntityMetaKey.Selector]: {
			$network,
			slot,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: Math.floor(slot / slotsPerEpoch),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
				[EntityMetaKey.Selector]: {
					$network,
					epoch: Math.floor(slot / slotsPerEpoch),
				},
			},
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'bodyRoot')]: with0xHex(header.header.message.body_root),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: header.canonical,
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: with0xHex(header.header.message.parent_root),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: safeIntegerFromDecimal(header.header.message.proposer_index, 'proposer index'),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: with0xHex(header.root),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: with0xHex(header.header.signature),
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: with0xHex(header.header.message.state_root),
		},
	}
}

const mapBeaconValidatorSnapshot = async (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	indexOrPubkey: number | string,
	requestedSlot?: number
) => {
	const { getHeadSlot, getValidator } = await import('$/sources/Beacon/Rest/queries.ts')
	const chainId = eip155ChainId($network)
	const observationSlot = safeIntegerFromDecimal(
		requestedSlot == null ? await getHeadSlot(chainId) : String(requestedSlot),
		requestedSlot == null ? 'head slot' : 'validator observation slot'
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
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }) => {
						const {
							getBeaconBlockSnapshot,
							getHeadersAtSlot,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						const timestampMs = Date.now()
						return (await Promise.all((
							await getHeadersAtSlot(chainId, slot)
						).map((header) => (
							getBeaconBlockSnapshot(chainId, header.root)
						)))).map((block) => ({
							[EntityMetaKey.Selector]: {
								$network,
								root: block.root,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.BeaconBlock, [], '$slot')]: {
									[EntityMetaKey.Selector]: {
										$network,
										slot: block.slot,
									},
								},
								[entityFieldAddressKey(EntityType.BeaconBlock, [], '$proposer')]: {
									[EntityMetaKey.Selector]: {
										$network,
										indexInNetwork: block.proposerIndex,
									},
								},
								...(block.slot > 0 && {
									[entityFieldAddressKey(EntityType.BeaconBlock, [], '$parent')]: {
										[EntityMetaKey.Selector]: {
											$network,
											root: block.parentRoot,
										},
									},
								}),
								[entityFieldAddressKey(EntityType.BeaconBlock, [], 'version')]: block.version,
								[entityFieldAddressKey(EntityType.BeaconBlock, [], 'stateRoot')]: block.stateRoot,
								[entityFieldAddressKey(EntityType.BeaconBlock, [], 'bodyRoot')]: block.bodyRoot,
								[entityFieldAddressKey(EntityType.BeaconBlock, [], 'signature')]: block.signature,
								...(block.executionBlockHash != null && {
									[entityFieldAddressKey(EntityType.BeaconBlock, [], '$executionBlock')]: {
										[EntityMetaKey.Selector]: {
											$network,
											hash: block.executionBlockHash,
										},
									},
								}),
								...(block.executionPayloadBid != null && {
									[entityFieldAddressKey(EntityType.BeaconBlock, [], '$executionPayloadBid')]: {
										[EntityMetaKey.Selector]: {
											$beaconBlock: {
												$network,
												root: block.root,
											},
										},
									},
								}),
								[entityFieldAddressKey(EntityType.BeaconBlock, [], '$$timestamps')]: [{
									[EntityMetaKey.Selector]: {
										$block: {
											$network,
											root: block.root,
										},
										timestampMs,
										source: Source.Beacon_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'canonical')]: block.canonical,
										[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'executionOptimistic')]: block.executionOptimistic,
										[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'finalized')]: block.finalized,
									},
								}],
							},
						}))
					},
				},
			},
		})({
			$$blocks: (blocks) => blocks,
		}),

		defineResolver({
			entityType: EntityType.BeaconBlock,
			resolve: {
				NetworkRoot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, root }) => {
						const {
							getBeaconBlockSnapshot,
							getExecutionPayloadEnvelope,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const block = await getBeaconBlockSnapshot(
							eip155ChainId($network),
							root
						)
						if (block.root.toLowerCase() !== root.toLowerCase())
							throw new Error('Beacon_Rest: block root does not match selector')

						const envelope = (
							block.executionPayloadBid == null ?
								null
								:
								await getExecutionPayloadEnvelope(
									eip155ChainId($network),
									block.root
								)
						)
						if (envelope != null)
							assertExecutionPayloadEnvelopeMatchesBlock(block, envelope)

						const timestampMs = Date.now()
						return {
							$network,
							root: block.root,
							$slot: {
								[EntityMetaKey.Selector]: {
									$network,
									slot: block.slot,
								},
							},
							$proposer: {
								[EntityMetaKey.Selector]: {
									$network,
									indexInNetwork: block.proposerIndex,
								},
							},
							...(block.slot > 0 && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network,
										root: block.parentRoot,
									},
								},
							}),
							version: block.version,
							stateRoot: block.stateRoot,
							bodyRoot: block.bodyRoot,
							signature: block.signature,
							...(block.executionBlockHash != null && {
								$executionBlock: {
									[EntityMetaKey.Selector]: {
										$network,
										hash: block.executionBlockHash,
									},
								},
							}),
							...(block.executionPayloadBid != null && {
								$executionPayloadBid: {
									[EntityMetaKey.Selector]: {
										$beaconBlock: {
											$network,
											root: block.root,
										},
									},
								},
							}),
							...(envelope != null && {
								$executionPayloadEnvelope: {
									[EntityMetaKey.Selector]: {
										$beaconBlock: {
											$network,
											root: block.root,
										},
									},
								},
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$block: {
										$network,
										root: block.root,
									},
									timestampMs,
									source: Source.Beacon_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'canonical')]: block.canonical,
									[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'executionOptimistic')]: block.executionOptimistic,
									[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'finalized')]: block.finalized,
								},
							}],
						}
					},
				},
			},
		})({
			$network: (block) => block.$network,
			root: (block) => block.root,
			$slot: (block) => block.$slot,
			$proposer: (block) => block.$proposer,
			$parent: (block) => block.$parent,
			version: (block) => block.version,
			stateRoot: (block) => block.stateRoot,
			bodyRoot: (block) => block.bodyRoot,
			signature: (block) => block.signature,
			$executionBlock: (block) => block.$executionBlock,
			$executionPayloadBid: (block) => block.$executionPayloadBid,
			$executionPayloadEnvelope: (block) => block.$executionPayloadEnvelope,
			$$timestamps: (block) => block.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BeaconExecutionPayloadBid,
			resolve: {
				BeaconBlock: {
					resolve: async ({ $beaconBlock }) => {
						const { getBeaconBlockSnapshot } = await import('$/sources/Beacon/Rest/queries.ts')
						const block = await getBeaconBlockSnapshot(
							eip155ChainId($beaconBlock.$network),
							$beaconBlock.root
						)
						if (
							block.root.toLowerCase() !== $beaconBlock.root.toLowerCase()
							|| block.executionPayloadBid == null
						) throw new Error('Beacon_Rest: selected execution payload bid not found')

						return {
							$beaconBlock: {
								[EntityMetaKey.Selector]: {
									$network: $beaconBlock.$network,
									root: block.root,
								},
							},
							builderIndex: block.executionPayloadBid.builderIndex,
							parentExecutionBlockHash: block.executionPayloadBid.parentExecutionBlockHash,
							executionBlockHash: block.executionPayloadBid.executionBlockHash,
							prevRandao: block.executionPayloadBid.prevRandao,
							feeRecipient: block.executionPayloadBid.feeRecipient,
							gasLimit: block.executionPayloadBid.gasLimit,
							valueGwei: block.executionPayloadBid.valueGwei,
							executionPaymentGwei: block.executionPayloadBid.executionPaymentGwei,
							blobKzgCommitments: block.executionPayloadBid.blobKzgCommitments,
							executionRequestsRoot: block.executionPayloadBid.executionRequestsRoot,
							signature: block.executionPayloadBid.signature,
						}
					},
				},
			},
		})({
			$beaconBlock: (bid) => bid.$beaconBlock,
			builderIndex: (bid) => bid.builderIndex,
			parentExecutionBlockHash: (bid) => bid.parentExecutionBlockHash,
			executionBlockHash: (bid) => bid.executionBlockHash,
			prevRandao: (bid) => bid.prevRandao,
			feeRecipient: (bid) => bid.feeRecipient,
			gasLimit: (bid) => bid.gasLimit,
			valueGwei: (bid) => bid.valueGwei,
			executionPaymentGwei: (bid) => bid.executionPaymentGwei,
			blobKzgCommitments: (bid) => bid.blobKzgCommitments,
			executionRequestsRoot: (bid) => bid.executionRequestsRoot,
			signature: (bid) => bid.signature,
		}),

		defineResolver({
			entityType: EntityType.BeaconExecutionPayloadEnvelope,
			resolve: {
				BeaconBlock: {
					resolve: async ({ $beaconBlock }) => {
						const {
							getBeaconBlockSnapshot,
							getExecutionPayloadEnvelope,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const [
							block,
							envelope,
						] = await Promise.all([
							getBeaconBlockSnapshot(
								eip155ChainId($beaconBlock.$network),
								$beaconBlock.root
							),
							getExecutionPayloadEnvelope(
								eip155ChainId($beaconBlock.$network),
								$beaconBlock.root
							),
						])
						if (envelope == null)
							throw new Error('Beacon_Rest: execution payload envelope not found')
						assertExecutionPayloadEnvelopeMatchesBlock(block, envelope)
						const executionTimestampMs = envelope.timestampSeconds * 1_000n
						if (executionTimestampMs > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Beacon_Rest: execution payload timestamp exceeds safe integer range')

						const timestampMs = Date.now()
						return {
							$beaconBlock: {
								[EntityMetaKey.Selector]: {
									$network: $beaconBlock.$network,
									root: block.root,
								},
							},
							$bid: {
								[EntityMetaKey.Selector]: {
									$beaconBlock: {
										$network: $beaconBlock.$network,
										root: block.root,
									},
								},
							},
							$executionBlock: {
								[EntityMetaKey.Selector]: {
									$network: $beaconBlock.$network,
									hash: envelope.executionBlockHash,
								},
							},
							$parentExecutionBlock: {
								[EntityMetaKey.Selector]: {
									$network: $beaconBlock.$network,
									hash: envelope.parentExecutionBlockHash,
								},
							},
							builderIndex: envelope.builderIndex,
							signature: envelope.signature,
							blockNumber: envelope.blockNumber,
							feeRecipient: envelope.feeRecipient,
							gasLimit: envelope.gasLimit,
							gasUsed: envelope.gasUsed,
							executionTimestampMs: Number(executionTimestampMs),
							slotNumber: envelope.slotNumber,
							baseFeePerGas: envelope.baseFeePerGas,
							blobGasUsed: envelope.blobGasUsed,
							excessBlobGas: envelope.excessBlobGas,
							blockAccessList: envelope.blockAccessList,
							transactionCount: envelope.transactionCount,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$envelope: {
										$beaconBlock: {
											$network: $beaconBlock.$network,
											root: block.root,
										},
									},
									timestampMs,
									source: Source.Beacon_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconExecutionPayloadEnvelope_Timestamp, [], 'executionOptimistic')]: envelope.executionOptimistic,
									[entityFieldAddressKey(EntityType.BeaconExecutionPayloadEnvelope_Timestamp, [], 'finalized')]: envelope.finalized,
								},
							}],
						}
					},
				},
			},
		})({
			$beaconBlock: (envelope) => envelope.$beaconBlock,
			$bid: (envelope) => envelope.$bid,
			$executionBlock: (envelope) => envelope.$executionBlock,
			$parentExecutionBlock: (envelope) => envelope.$parentExecutionBlock,
			builderIndex: (envelope) => envelope.builderIndex,
			signature: (envelope) => envelope.signature,
			blockNumber: (envelope) => envelope.blockNumber,
			feeRecipient: (envelope) => envelope.feeRecipient,
			gasLimit: (envelope) => envelope.gasLimit,
			gasUsed: (envelope) => envelope.gasUsed,
			executionTimestampMs: (envelope) => envelope.executionTimestampMs,
			slotNumber: (envelope) => envelope.slotNumber,
			baseFeePerGas: (envelope) => envelope.baseFeePerGas,
			blobGasUsed: (envelope) => envelope.blobGasUsed,
			excessBlobGas: (envelope) => envelope.excessBlobGas,
			blockAccessList: (envelope) => envelope.blockAccessList,
			transactionCount: (envelope) => envelope.transactionCount,
			$$timestamps: (envelope) => envelope.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getDataColumnSidecars } = await import('$/sources/Beacon/Rest/queries.ts')
						const sidecars = await getDataColumnSidecars(
							eip155ChainId($network),
							slot
						)
						const timestampMs = Date.now()
						return sidecars.sidecars
							.slice(0, resolverContextRowLimit(context))
							.map((sidecar) => beaconDataColumnReference(beaconDataColumnSnapshot(
								$network,
								slot,
								sidecars,
								sidecar,
								timestampMs
							)))
					},
				},
			},
		})({
				$$dataColumns: (slot) => slot,
			}),

		defineResolver({
			entityType: EntityType.BeaconDataColumn,
			resolve: {
				SlotColumnIndex: {
					resolve: async ({ $slot, columnIndex }) => {
						const { getDataColumnSidecars } = await import('$/sources/Beacon/Rest/queries.ts')
						const sidecars = await getDataColumnSidecars(
							eip155ChainId($slot.$network),
							$slot.slot,
							[columnIndex]
						)
						if (sidecars.sidecars.length !== 1 || sidecars.sidecars[0].index !== columnIndex)
							throw new Error(`Beacon_Rest: data column ${String(columnIndex)} not found`)

						return beaconDataColumnSnapshot(
							$slot.$network,
							$slot.slot,
							sidecars,
							sidecars.sidecars[0],
							Date.now()
						)
					},
				},
			},
		})({
				$slot: (column) => column.$slot,
				columnIndex: (column) => column.columnIndex,
				forkVersion: (column) => column.forkVersion,
				columnCount: (column) => column.columnCount,
				columns: (column) => column.columns,
				kzgProofs: (column) => column.kzgProofs,
				kzgCommitments: (column) => column.kzgCommitments,
				beaconBlockRoot: (column) => column.beaconBlockRoot,
				$$timestamps: (column) => column.$$timestamps,
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
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }) => {
						const { getBlockRewards } = await import('$/sources/Beacon/Rest/queries.ts')
						return getBlockRewards(
							eip155ChainId($network),
							slot
						)
					},
				},
			},
		})({
				rewardTotalGwei: (rewards) => rewards.totalGwei,
				rewardAttestationsGwei: (rewards) => rewards.attestationsGwei,
				rewardSyncAggregateGwei: (rewards) => rewards.syncAggregateGwei,
				rewardProposerSlashingsGwei: (rewards) => rewards.proposerSlashingsGwei,
				rewardAttesterSlashingsGwei: (rewards) => rewards.attesterSlashingsGwei,
				rewardExecutionOptimistic: (rewards) => rewards.executionOptimistic,
				rewardFinalized: (rewards) => rewards.finalized,
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
							indexOrPubkey,
							slot
						)
						const observation = snapshot.timestamps[0]

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
			entityType: EntityType.BeaconValidator_Timestamp,
			resolve: {
				ValidatorSlotSource: {
					resolve: async ({ $validator, slot, source }) => {
						if (source !== Source.Beacon_Rest)
							throw new Error(`Beacon_Rest: unsupported reward source ${source}`)
						if (slot % slotsPerEpoch !== slotsPerEpoch - 1)
							throw new Error('Beacon_Rest: validator reward observations use the epoch end slot')
						const validatorId = (
							'indexInNetwork' in $validator ?
								$validator.indexInNetwork
							:
								$validator.pubkey
						)
						const { getAttestationRewards, getSyncCommitteeRewards } = await import('$/sources/Beacon/Rest/queries.ts')
						const [attestationResponse, syncResponse] = await Promise.all([
							getAttestationRewards(eip155ChainId($validator.$network), Math.floor(slot / slotsPerEpoch), [validatorId]),
							getSyncCommitteeRewards(eip155ChainId($validator.$network), slot, [validatorId]),
						])
							const attestationReward = attestationResponse.rewards.at(0)
						if (attestationReward == null)
							throw new Error('Beacon_Rest: validator attestation reward not found')
						if (
							attestationResponse.finalized !== syncResponse.finalized
							|| attestationResponse.executionOptimistic !== syncResponse.executionOptimistic
						)
							throw new Error('Beacon_Rest: validator reward finality conflict')
							const syncCommitteeReward = syncResponse.rewards.at(0)
							return {
							attestationHeadRewardGwei: attestationReward.headGwei,
							attestationTargetRewardGwei: attestationReward.targetGwei,
							attestationSourceRewardGwei: attestationReward.sourceGwei,
							...(attestationReward.inclusionDelayGwei != null && { attestationInclusionDelayRewardGwei: attestationReward.inclusionDelayGwei }),
							attestationInactivityRewardGwei: attestationReward.inactivityGwei,
								...(syncCommitteeReward != null && { syncCommitteeRewardGwei: syncCommitteeReward.rewardGwei }),
							rewardFinalized: attestationResponse.finalized,
							rewardExecutionOptimistic: attestationResponse.executionOptimistic,
						}
					},
				},
			},
		})({
				attestationHeadRewardGwei: (reward) => reward.attestationHeadRewardGwei,
				attestationTargetRewardGwei: (reward) => reward.attestationTargetRewardGwei,
				attestationSourceRewardGwei: (reward) => reward.attestationSourceRewardGwei,
				attestationInclusionDelayRewardGwei: (reward) => reward.attestationInclusionDelayRewardGwei,
				attestationInactivityRewardGwei: (reward) => reward.attestationInactivityRewardGwei,
				syncCommitteeRewardGwei: (reward) => reward.syncCommitteeRewardGwei,
				rewardFinalized: (reward) => reward.rewardFinalized,
				rewardExecutionOptimistic: (reward) => reward.rewardExecutionOptimistic,
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
			entityType: EntityType.BeaconDeposit,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, indexInSlot }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const deposit = (await getBlockDutySummary(eip155ChainId($network), slot)).deposits.at(indexInSlot)
						if (deposit == null)
							throw new Error('Beacon_Rest: deposit not found')

						return {
							pubkey: deposit.pubkey,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network,
									pubkey: deposit.pubkey,
								},
							},
							withdrawalCredentials: deposit.withdrawalCredentials,
							amountGwei: deposit.amountGwei,
							signature: deposit.signature,
							proof: deposit.proof,
						}
					},
				},
			},
		})({
			pubkey: (deposit) => deposit.pubkey,
			$validator: (deposit) => deposit.$validator,
			withdrawalCredentials: (deposit) => deposit.withdrawalCredentials,
			amountGwei: (deposit) => deposit.amountGwei,
			signature: (deposit) => deposit.signature,
			proof: (deposit) => deposit.proof,
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
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, epoch }, context) => {
						const {
							getBlockRewards,
							getHeadersAtSlot,
							getProposerDuties,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						const duties = await getProposerDuties(chainId, epoch)
						if (duties.some((duty) => (
							Number(duty.slot) < epoch * slotsPerEpoch
							|| Number(duty.slot) >= (epoch + 1) * slotsPerEpoch
						)))
							throw new Error(`Beacon_Rest: proposer duty outside epoch ${String(epoch)}`)
						return Promise.all(
							duties
								.slice(0, Math.min(resolverContextRowLimit(context), slotsPerEpoch))
								.map(async (duty) => {
									const slot = Number(duty.slot)
									const headers = await getHeadersAtSlot(chainId, slot)
									if (headers.length > 1)
										throw new Error(`Beacon_Rest: multiple canonical headers returned for slot ${String(slot)}`)
									if (headers.length === 0)
										return {
											[EntityMetaKey.Selector]: {
												$network,
												slot,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: epoch,
												[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: Number(duty.validator_index),
											},
										}
									const rewards = await getBlockRewards(chainId, slot)
									const slotReference = beaconSlotReferenceFromHeader($network, headers[0])
									return {
										...slotReference,
										[EntityMetaKey.Fields]: {
											...slotReference[EntityMetaKey.Fields],
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardTotalGwei')]: rewards.totalGwei,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardAttestationsGwei')]: rewards.attestationsGwei,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardSyncAggregateGwei')]: rewards.syncAggregateGwei,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardProposerSlashingsGwei')]: rewards.proposerSlashingsGwei,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardAttesterSlashingsGwei')]: rewards.attesterSlashingsGwei,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardExecutionOptimistic')]: rewards.executionOptimistic,
											[entityFieldAddressKey(EntityType.BeaconSlot, [], 'rewardFinalized')]: rewards.finalized,
										},
									}
								})
						)
					},
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
						const { getHeader } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headHeader = await getHeader(chainId, 'head')
						const headSlot = safeIntegerFromDecimal(
							headHeader.header.message.slot,
							'head slot'
						)
						return Promise.all(
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => headSlot - i
							)
								.flatMap((slot) => (
									slot < 0 ?
										[]
									:
											[(slot === headSlot ? Promise.resolve(headHeader) : getHeader(chainId, slot))
												.then((header) => beaconSlotReferenceFromHeader({ caip2 }, header))]
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
						const {
							getHeadSlot,
							getRecentProposerValidatorIndices,
							getValidators,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const chainId = Number(caip2.reference)
						if (limit === 0)
							return []

						const headSlot = safeIntegerFromDecimal(
							await getHeadSlot(chainId),
							'head slot'
						)
						const proposerIndices = await getRecentProposerValidatorIndices({
							chainId,
							headSlot,
							limit,
							slotLookbackCap: Math.min(384, Math.max(limit * 8, slotsPerEpoch)),
						})
						const envelope = await getValidators(
							chainId,
							proposerIndices,
							headSlot
						)
						const validatorByIndex = new Map(
							envelope.validators.map((validator) => [validator.index, validator])
						)
						return proposerIndices.flatMap((validatorIndex) => {
							const validator = validatorByIndex.get(validatorIndex)
							if (validator == null)
								return []

							const observation = mapBeaconValidatorObservation({
								validator,
								executionOptimistic: envelope.executionOptimistic,
								finalized: envelope.finalized,
							})
							const $validator = {
								$network: { caip2 },
								indexInNetwork: safeIntegerFromDecimal(
									validatorIndex,
									'proposer index'
								),
							}
							return [{
								[EntityMetaKey.Selector]: $validator,
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconValidator, [], 'pubkey')]: validator.validator.pubkey.toLowerCase(),
									[entityFieldAddressKey(EntityType.BeaconValidator, [], 'balanceGwei')]: observation.balanceGwei,
									[entityFieldAddressKey(EntityType.BeaconValidator, [], 'effectiveBalanceGwei')]: observation.effectiveBalanceGwei,
									[entityFieldAddressKey(EntityType.BeaconValidator, [], 'status')]: observation.status,
									[entityFieldAddressKey(EntityType.BeaconValidator, [], 'slashed')]: observation.slashed,
									[entityFieldAddressKey(EntityType.BeaconValidator, [], '$$timestamps')]: [{
										[EntityMetaKey.Selector]: {
											$validator,
											slot: headSlot,
											source: Source.Beacon_Rest,
										},
										[EntityMetaKey.Fields]: observationFields(observation),
									}],
								},
							}]
						})
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
							deposits: summary.deposits
								.slice(0, limit)
								.map((deposit) => beaconDepositReference($network, slot, deposit)),
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
				$$beaconDeposits: (slot) => slot.deposits,
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
						const { getHeadSlot, getSyncCommittee } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const headPeriod = Math.floor(
							Math.floor(
								safeIntegerFromDecimal(
									await getHeadSlot(chainId),
									'head slot'
								) / slotsPerEpoch
							) / epochsPerSyncCommitteePeriod
						)
						return Promise.all(
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => headPeriod - i
							)
								.flatMap((period) => (
									period < 0 ?
										[]
									:
											[Promise.resolve(getSyncCommittee(
												chainId,
												period * epochsPerSyncCommitteePeriod * slotsPerEpoch
											)).then((committee) => {
												if (committee == null)
													throw new Error(`Beacon_Rest: sync committee ${String(period)} not found`)

												return {
												[EntityMetaKey.Selector]: {
													$network: { caip2 },
													period,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.BeaconSyncCommittee, [], 'validatorIndices')]: committee.validators.map(Number),
												},
												}
											})]
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
						const chainId = Number(caip2.reference)
						if (!beaconRestByChainId.has(chainId))
							return []

						const { getFinalityCheckpoints } = await import('$/sources/Beacon/Rest/queries.ts')
						const checkpoints = await getFinalityCheckpoints(chainId)
						if (checkpoints == null)
							throw new Error(`Beacon_Rest: finality checkpoints not returned for chain ${String(chainId)}`)

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: { caip2 },
									timestampMs: Date.now(),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointEpoch')]: Number.parseInt(checkpoints.current_justified.epoch, 10),
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointRoot')]: with0xHex(checkpoints.current_justified.root),
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointEpoch')]: Number.parseInt(checkpoints.previous_justified.epoch, 10),
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointRoot')]: with0xHex(checkpoints.previous_justified.root),
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointEpoch')]: Number.parseInt(checkpoints.finalized.epoch, 10),
									[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointRoot')]: with0xHex(checkpoints.finalized.root),
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
