import {
	resolverContextRowLimit,
	type ResolverContext,
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

const eip155BeaconBlockApplicability = [{
	$block: {
		$network: {
			caip2: {
				namespace: 'eip155',
			},
		},
	},
}] as const

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

const beaconPaginationOffset = (
	context: ResolverContext
) => {
	const offset = (
		context.providerContinuationToken == null ?
			context.pagination.offset ?? 0
		:
			Number(context.providerContinuationToken)
	)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Beacon_Rest: invalid collection pagination offset')

	return offset
}

const beaconCollectionContinuation = (
	operation: string,
	offset: number,
	rowCount: number,
	totalCount: number
) => {
	const nextOffset = offset + rowCount
	const terminal = rowCount === 0 || nextOffset >= totalCount

	return {
		operation,
		target: 'beacon-rest',
		terminal,
		...(!terminal && { token: String(nextOffset) }),
	}
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

const getExecutionPayloadEnvelopeForBlock = async (
	$beaconBlock: EntitySelector<typeof schema, EntityType.BeaconBlock>
) => {
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
	return {
		block,
		envelope,
	}
}

const beaconDataColumnSnapshot = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	sidecars: BeaconDataColumnSidecars & { endpointUrl: string },
	sidecar: BeaconDataColumnSidecars['sidecars'][number],
	timestampMs: number
) => {
	if (
		sidecar.beaconBlockRoot != null
		&& sidecar.beaconBlockRoot.toLowerCase() !== $block.root.toLowerCase()
	)
		throw new Error('Beacon_Rest: data column does not match requested block root')
	const $dataColumn = {
		$block,
		columnIndex: sidecar.index,
	}
	return {
		$block: {
			[EntityMetaKey.Selector]: $block,
		},
		columnIndex: sidecar.index,
		forkVersion: sidecars.version,
		columnCount: sidecar.columns.length,
		columns: sidecar.columns,
		kzgProofs: sidecar.kzgProofs,
		kzgCommitments: sidecar.kzgCommitments,
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
		$block: snapshot.$block[EntityMetaKey.Selector],
		columnIndex: snapshot.columnIndex,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], '$block')]: snapshot.$block,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'forkVersion')]: snapshot.forkVersion,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'columnCount')]: snapshot.columnCount,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'columns')]: snapshot.columns,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'kzgProofs')]: snapshot.kzgProofs,
		[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'kzgCommitments')]: snapshot.kzgCommitments,
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
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	attestation: BeaconBlockDutySummary['attestations'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$block,
		indexInBlock: attestation.indexInBlock,
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
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	withdrawal: BeaconBlockDutySummary['withdrawals'][number]
) => {
	if (
		withdrawal.validatorIndex == null
		|| withdrawal.address == null
		|| withdrawal.amountGwei == null
	)
		throw new Error('Beacon_Rest: withdrawal is missing required Capella fields')

	return {
		[EntityMetaKey.Selector]: {
			$block,
			withdrawalIndex: withdrawal.withdrawalIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'indexInBlock')]: withdrawal.indexInBlock,
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$validator')]: {
				[EntityMetaKey.Selector]: {
					$network: $block.$network,
					indexInNetwork: withdrawal.validatorIndex,
				},
			},
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$account')]: {
				[EntityMetaKey.Selector]: {
					address: with0xHex(withdrawal.address),
				},
			},
			[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: withdrawal.amountGwei,
		},
	}
}

const beaconDepositReference = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	deposit: BeaconBlockDutySummary['deposits'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$block,
		indexInBlock: deposit.indexInBlock,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'pubkey')]: deposit.pubkey,
		[entityFieldAddressKey(EntityType.BeaconDeposit, [], '$validator')]: {
			[EntityMetaKey.Selector]: {
				$network: $block.$network,
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
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	slashing: BeaconBlockDutySummary['slashings'][number]
) => ({
	[EntityMetaKey.Selector]: {
		$block,
		kind: slashing.kind,
		indexInKind: slashing.indexInKind,
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

const beaconSlotReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: number
) => {
	const epoch = Math.floor(slot / slotsPerEpoch)
	return {
		[EntityMetaKey.Selector]: {
			$network,
			slot,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: epoch,
			[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
				[EntityMetaKey.Selector]: {
					$network,
					epoch,
				},
			},
		},
	}
}

const beaconEpochReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	epoch: number,
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		epoch,
	},
})

const descendingIntegerContinuation = (
	operation: string,
	last: number | undefined
) => (
	last == null || last === 0 ?
		{
			operation,
			terminal: true as const,
		}
	:
		{
			operation,
			terminal: false as const,
			token: String(last - 1),
		}
)

const continuationStartInteger = (
	token: string | undefined,
	fallback: number,
	description: string
) => {
	if (token == null)
		return fallback
	if (!/^(0|[1-9][0-9]*)$/.test(token))
		throw new Error(`Beacon_Rest: invalid ${description} continuation`)
	const start = Number(token)
	if (!Number.isSafeInteger(start))
		throw new Error(`Beacon_Rest: invalid ${description} continuation`)
	return start
}

const beaconRecentEpochReferences = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	startEpoch: number,
	limit: number
) => (
	Array.from(
		{ length: limit },
		(_, index) => startEpoch - index
	)
		.flatMap((epoch) => (
			epoch < 0 ?
				[]
			:
				[beaconEpochReference($network, epoch)]
		))
)

const beaconRecentSlotReferencesFromHead = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	headSlot: number,
	limit: number,
	startSlot?: number
) => {
	const fromSlot = startSlot ?? headSlot
	if (fromSlot > headSlot)
		throw new Error('Beacon_Rest: slots continuation exceeds head')
	return Array.from(
		{ length: limit },
		(_, index) => fromSlot - index
	)
		.flatMap((slot) => (
			slot < 0 ?
				[]
			:
				[beaconSlotReference($network, slot)]
		))
}

const beaconFinalityTimestampReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	checkpoints: NonNullable<
		Awaited<
			ReturnType<
				typeof import('$/sources/Beacon/Rest/queries.ts').getFinalityCheckpoints
			>
		>
	>,
	timestampMs: number,
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		timestampMs,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointEpoch')]: Number.parseInt(checkpoints.current_justified.epoch, 10),
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointRoot')]: with0xHex(checkpoints.current_justified.root),
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointEpoch')]: Number.parseInt(checkpoints.previous_justified.epoch, 10),
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointRoot')]: with0xHex(checkpoints.previous_justified.root),
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointEpoch')]: Number.parseInt(checkpoints.finalized.epoch, 10),
		[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointRoot')]: with0xHex(checkpoints.finalized.root),
	},
})

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
						const blocks = (await Promise.all((
							await getHeadersAtSlot(chainId, slot)
						).map((header) => (
							getBeaconBlockSnapshot(chainId, header.root)
						))))
						const executionBlockHashes = blocks.flatMap((block) => (
							block.executionBlockHash == null ?
								[]
							:
								[block.executionBlockHash]
						))
						const agreedExecutionBlockHash = (
							executionBlockHashes.length > 0
							&& new Set(executionBlockHashes.map((hash) => hash.toLowerCase())).size === 1
						) ?
							executionBlockHashes[0]
						:
							undefined
						return {
							blocks: blocks.map((block) => ({
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
							})),
							...(agreedExecutionBlockHash != null && {
								$executionBlock: {
									[EntityMetaKey.Selector]: {
										$network,
										hash: agreedExecutionBlockHash,
									},
								},
							}),
						}
					},
				},
			},
		})({
			$$blocks: {
				select: (slot) => slot.blocks,
				resolveCount: (slot) => slot.blocks.length,
			},
			$executionBlock: (slot) => slot.$executionBlock,
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
						const blockSelector = {
							$network,
							root: block.root,
						}
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
							$$attestations: block.attestations.map((attestation) => beaconAttestationReference(blockSelector, attestation)),
							$$deposits: block.deposits.map((deposit) => beaconDepositReference(blockSelector, deposit)),
							$$slashings: block.slashings.map((slashing) => beaconSlashingReference(blockSelector, slashing)),
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
							$$withdrawals: block.withdrawals.map((withdrawal) => beaconWithdrawalReference(blockSelector, withdrawal)),
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
			$$attestations: {
				select: (block) => block.$$attestations,
				resolveCount: (block) => block.$$attestations.length,
			},
			$$deposits: {
				select: (block) => block.$$deposits,
				resolveCount: (block) => block.$$deposits.length,
			},
			$$slashings: {
				select: (block) => block.$$slashings,
				resolveCount: (block) => block.$$slashings.length,
			},
			$$timestamps: (block) => block.$$timestamps,
			$$withdrawals: {
				select: (block) => block.$$withdrawals,
				resolveCount: (block) => block.$$withdrawals.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BeaconBlock,
			resolve: {
				NetworkRoot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({
						$network,
						root,
					}) => {
						const { getBlockRewards } = await import('$/sources/Beacon/Rest/queries.ts')
						return getBlockRewards(
							eip155ChainId($network),
							root
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
							block,
							envelope,
						} = await getExecutionPayloadEnvelopeForBlock($beaconBlock)
						const executionTimestampMs = envelope.timestampSeconds * 1_000n
						if (executionTimestampMs > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Beacon_Rest: execution payload timestamp exceeds safe integer range')

						const timestampMs = Date.now()
						const envelopeSelector = {
							$beaconBlock: {
								$network: $beaconBlock.$network,
								root: block.root,
							},
						}
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
							$$consolidationRequests: envelope.executionRequests.consolidations.map((request, indexInEnvelope) => ({
								[EntityMetaKey.Selector]: {
									$envelope: envelopeSelector,
									indexInEnvelope,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconExecutionConsolidationRequest, [], 'sourceAddress')]: request.sourceAddress,
									[entityFieldAddressKey(EntityType.BeaconExecutionConsolidationRequest, [], 'sourcePubkey')]: request.sourcePubkey,
									[entityFieldAddressKey(EntityType.BeaconExecutionConsolidationRequest, [], 'targetPubkey')]: request.targetPubkey,
								},
							})),
							$$depositRequests: envelope.executionRequests.deposits.map((request) => ({
								[EntityMetaKey.Selector]: {
									$envelope: envelopeSelector,
									requestIndex: request.requestIndex,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconExecutionDepositRequest, [], 'pubkey')]: request.pubkey,
									[entityFieldAddressKey(EntityType.BeaconExecutionDepositRequest, [], 'withdrawalCredentials')]: request.withdrawalCredentials,
									[entityFieldAddressKey(EntityType.BeaconExecutionDepositRequest, [], 'amountGwei')]: request.amountGwei,
									[entityFieldAddressKey(EntityType.BeaconExecutionDepositRequest, [], 'signature')]: request.signature,
								},
							})),
							$$withdrawalRequests: envelope.executionRequests.withdrawals.map((request, indexInEnvelope) => ({
								[EntityMetaKey.Selector]: {
									$envelope: envelopeSelector,
									indexInEnvelope,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BeaconExecutionWithdrawalRequest, [], 'sourceAddress')]: request.sourceAddress,
									[entityFieldAddressKey(EntityType.BeaconExecutionWithdrawalRequest, [], 'validatorPubkey')]: request.validatorPubkey,
									[entityFieldAddressKey(EntityType.BeaconExecutionWithdrawalRequest, [], 'amountGwei')]: request.amountGwei,
								},
							})),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$envelope: envelopeSelector,
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
			$$consolidationRequests: {
				select: (envelope) => envelope.$$consolidationRequests,
				resolveCount: (envelope) => envelope.$$consolidationRequests.length,
			},
			$$depositRequests: {
				select: (envelope) => envelope.$$depositRequests,
				resolveCount: (envelope) => envelope.$$depositRequests.length,
			},
			$$withdrawalRequests: {
				select: (envelope) => envelope.$$withdrawalRequests,
				resolveCount: (envelope) => envelope.$$withdrawalRequests.length,
			},
			$$timestamps: (envelope) => envelope.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BeaconExecutionConsolidationRequest,
			resolve: {
				EnvelopeIndexInEnvelope: {
					resolve: async ({ $envelope, indexInEnvelope }) => {
						const { envelope } = await getExecutionPayloadEnvelopeForBlock($envelope.$beaconBlock)
						const request = envelope.executionRequests.consolidations.at(indexInEnvelope)
						if (request == null)
							throw new Error(`Beacon_Rest: execution consolidation request ${String(indexInEnvelope)} not found`)

						return {
							$envelope: { [EntityMetaKey.Selector]: $envelope },
							indexInEnvelope,
							...request,
						}
					},
				},
			},
		})({
			$envelope: (request) => request.$envelope,
			indexInEnvelope: (request) => request.indexInEnvelope,
			sourceAddress: (request) => request.sourceAddress,
			sourcePubkey: (request) => request.sourcePubkey,
			targetPubkey: (request) => request.targetPubkey,
		}),

		defineResolver({
			entityType: EntityType.BeaconExecutionDepositRequest,
			resolve: {
				EnvelopeRequestIndex: {
					resolve: async ({ $envelope, requestIndex }) => {
						const { envelope } = await getExecutionPayloadEnvelopeForBlock($envelope.$beaconBlock)
						const request = envelope.executionRequests.deposits.find((candidate) => candidate.requestIndex === requestIndex)
						if (request == null)
							throw new Error(`Beacon_Rest: execution deposit request ${String(requestIndex)} not found`)

						return {
							$envelope: { [EntityMetaKey.Selector]: $envelope },
							...request,
						}
					},
				},
			},
		})({
			$envelope: (request) => request.$envelope,
			requestIndex: (request) => request.requestIndex,
			pubkey: (request) => request.pubkey,
			withdrawalCredentials: (request) => request.withdrawalCredentials,
			amountGwei: (request) => request.amountGwei,
			signature: (request) => request.signature,
		}),

		defineResolver({
			entityType: EntityType.BeaconExecutionWithdrawalRequest,
			resolve: {
				EnvelopeIndexInEnvelope: {
					resolve: async ({ $envelope, indexInEnvelope }) => {
						const { envelope } = await getExecutionPayloadEnvelopeForBlock($envelope.$beaconBlock)
						const request = envelope.executionRequests.withdrawals.at(indexInEnvelope)
						if (request == null)
							throw new Error(`Beacon_Rest: execution withdrawal request ${String(indexInEnvelope)} not found`)

						return {
							$envelope: { [EntityMetaKey.Selector]: $envelope },
							indexInEnvelope,
							...request,
						}
					},
				},
			},
		})({
			$envelope: (request) => request.$envelope,
			indexInEnvelope: (request) => request.indexInEnvelope,
			sourceAddress: (request) => request.sourceAddress,
			validatorPubkey: (request) => request.validatorPubkey,
			amountGwei: (request) => request.amountGwei,
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const {
							getDataColumnSidecars,
							getHeadersAtSlot,
						} = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						const headers = await getHeadersAtSlot(chainId, slot)
						const timestampMs = Date.now()
						const columns = (await Promise.all(headers.map(async (header) => {
							const sidecars = await getDataColumnSidecars(chainId, header.root)
							return sidecars.sidecars.map((sidecar) => {
								if (sidecar.slot !== slot)
									throw new Error(`Beacon_Rest: data column slot ${String(sidecar.slot)} does not match requested slot ${String(slot)}`)

								return beaconDataColumnReference(beaconDataColumnSnapshot(
									{
										$network,
										root: header.root,
									},
									sidecars,
									sidecar,
									timestampMs
								))
							})
						})))
							.flat()
						return {
							columns: columns.slice(0, resolverContextRowLimit(context)),
							columnCount: columns.length,
						}
					},
				},
			},
		})({
				$$dataColumns: {
					select: (slot) => slot.columns,
					resolveCount: (slot) => slot.columnCount,
				},
			}),

		defineResolver({
			entityType: EntityType.BeaconDataColumn,
			resolve: {
				BlockColumnIndex: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, columnIndex }) => {
						const { getDataColumnSidecars } = await import('$/sources/Beacon/Rest/queries.ts')
						const sidecars = await getDataColumnSidecars(
							eip155ChainId($block.$network),
							$block.root,
							[columnIndex]
						)
						if (sidecars.sidecars.length !== 1 || sidecars.sidecars[0].index !== columnIndex)
							throw new Error(`Beacon_Rest: data column ${String(columnIndex)} not found`)

						return beaconDataColumnSnapshot(
							$block,
							sidecars,
							sidecars.sidecars[0],
							Date.now()
						)
					},
				},
			},
		})({
				$block: (column) => column.$block,
				columnIndex: (column) => column.columnIndex,
				forkVersion: (column) => column.forkVersion,
				columnCount: (column) => column.columnCount,
				columns: (column) => column.columns,
				kzgProofs: (column) => column.kzgProofs,
				kzgCommitments: (column) => column.kzgCommitments,
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
				BlockIndexInBlock: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, indexInBlock }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const deposit = (
							await getBlockDutySummary(
								eip155ChainId($block.$network),
								$block.root
							)
						).deposits.find((candidate) => candidate.indexInBlock === indexInBlock)
						if (deposit == null)
							throw new Error('Beacon_Rest: deposit not found')

						return {
							pubkey: deposit.pubkey,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
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
				BlockIndexInBlock: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, indexInBlock }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const attestation = (
							await getBlockDutySummary(
								eip155ChainId($block.$network),
								$block.root
							)
						).attestations.find((candidate) => candidate.indexInBlock === indexInBlock)
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
				BlockWithdrawalIndex: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, withdrawalIndex }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const withdrawal = (
							await getBlockDutySummary(
								eip155ChainId($block.$network),
								$block.root
							)
						).withdrawals.find((candidate) => candidate.withdrawalIndex === withdrawalIndex)
						if (withdrawal == null) throw new Error('Beacon_Rest: withdrawal not found')
						if (
							withdrawal.validatorIndex == null
							|| withdrawal.address == null
							|| withdrawal.amountGwei == null
						)
							throw new Error('Beacon_Rest: withdrawal is missing required Capella fields')
						return {
							indexInBlock: withdrawal.indexInBlock,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
									indexInNetwork: withdrawal.validatorIndex,
								},
							},
							$account: {
								[EntityMetaKey.Selector]: {
									address: with0xHex(withdrawal.address),
								},
							},
							amountGwei: withdrawal.amountGwei,
						}
					},
				},
			},
		})({
				indexInBlock: (withdrawal) => withdrawal.indexInBlock,
				$validator: (withdrawal) => withdrawal.$validator,
				$account: (withdrawal) => withdrawal.$account,
				amountGwei: (withdrawal) => withdrawal.amountGwei,
			}),

		defineResolver({
			entityType: EntityType.BeaconSlashing,
			resolve: {
				BlockKindIndexInKind: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, kind, indexInKind }) => {
						const { getBlockDutySummary } = await import('$/sources/Beacon/Rest/queries.ts')
						const slashing = (
							await getBlockDutySummary(
								eip155ChainId($block.$network),
								$block.root
							)
						).slashings.find((candidate) => (
							candidate.kind === kind
							&& candidate.indexInKind === indexInKind
						))
						if (slashing == null) throw new Error('Beacon_Rest: slashing not found')
						return slashing
					},
				},
			},
		})({
				kind: (slashing) => slashing.kind,
				indexInKind: (slashing) => slashing.indexInKind,
			}),

		defineResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, epoch }, context) => {
						const { getProposerDuties } = await import('$/sources/Beacon/Rest/queries.ts')
						const duties = await getProposerDuties(eip155ChainId($network), epoch)
						if (duties.some((duty) => (
							Number(duty.slot) < epoch * slotsPerEpoch
							|| Number(duty.slot) >= (epoch + 1) * slotsPerEpoch
						)))
							throw new Error(`Beacon_Rest: proposer duty outside epoch ${String(epoch)}`)
						return {
							slots: duties
								.slice(0, Math.min(resolverContextRowLimit(context), slotsPerEpoch))
								.map((duty) => beaconSlotReference($network, Number(duty.slot))),
							slotCount: duties.length,
						}
					},
				},
			},
		})({
				$$beaconSlots: {
					select: (epoch) => epoch.slots,
					resolveCount: (epoch) => epoch.slotCount,
				},
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
						const offset = context.pagination.offset ?? 0
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Beacon_Rest: invalid epochs offset')
						const startEpoch = continuationStartInteger(
							context.providerContinuationToken,
							headEpoch - offset,
							'epochs'
						)
						if (startEpoch > headEpoch)
							throw new Error('Beacon_Rest: epochs continuation exceeds head')
						return {
							epochs: startEpoch < 0 ?
								[]
							:
								beaconRecentEpochReferences(
									{ caip2 },
									startEpoch,
									resolverContextRowLimit(context)
								),
							epochCount: headEpoch + 1,
						}
					},
				},
			},
		})({
				Evm: {
					$$beaconEpochs: {
						select: (network) => network.epochs,
						resolveCount: (network) => network.epochCount,
						continuation: (network) => descendingIntegerContinuation(
							'network-beacon-epochs',
							network.epochs.at(-1)?.[EntityMetaKey.Selector].epoch
						),
					},
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
						const offset = context.pagination.offset ?? 0
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Beacon_Rest: invalid slots offset')
						const startSlot = continuationStartInteger(
							context.providerContinuationToken,
							headSlot - offset,
							'slots'
						)
						return {
							slots: startSlot < 0 ?
								[]
							:
								beaconRecentSlotReferencesFromHead(
									{ caip2 },
									headSlot,
									resolverContextRowLimit(context),
									startSlot
								),
							slotCount: headSlot + 1,
						}
					},
				},
			},
			resolveLive: {
				beaconHead: {
					facetPath: [
						'Evm',
					],
					publishes: {
						'$$beaconSlots': true,
						'$$beaconEpochs': true,
						'$$beaconFinalityTimestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
						trigger,
					}) => {
						if (!('caip2' in parentEntitySelector))
							return

						const chainId = Number(parentEntitySelector.caip2.reference)
						if (!beaconRestByChainId.has(chainId))
							return

						let timeout: ReturnType<typeof setTimeout> | undefined
						let lastHeadSlot: number | undefined
						let lastHeadRoot: string | undefined
						let lastHeadEpoch: number | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return

								const {
									getFinalityCheckpoints,
									getHeader,
								} = await import('$/sources/Beacon/Rest/queries.ts')
								const limit = resolverContextRowLimit(trigger)
								const [
									headHeader,
									checkpoints,
								] = await Promise.all([
									getHeader(chainId, 'head'),
									getFinalityCheckpoints(chainId),
								])
								if (signal.aborted)
									return

								const headSlot = safeIntegerFromDecimal(
									headHeader.header.message.slot,
									'head slot'
								)
								const headRoot = with0xHex(headHeader.root)
								const headEpoch = Math.floor(headSlot / slotsPerEpoch)
								if (
									lastHeadSlot !== headSlot
									|| lastHeadRoot !== headRoot
								) {
									const recentSlots = beaconRecentSlotReferencesFromHead(
										parentEntitySelector,
										headSlot,
										limit
									)
									if (signal.aborted)
										return

									fields.$$beaconSlots.replaceRows([{
										source: Source.Beacon_Rest,
										value: recentSlots,
									}])
									fields.$$beaconSlots.count.replaceRows([{
										source: Source.Beacon_Rest,
										value: headSlot + 1,
									}])
									lastHeadSlot = headSlot
									lastHeadRoot = headRoot
								}
								if (lastHeadEpoch !== headEpoch) {
									lastHeadEpoch = headEpoch
									fields.$$beaconEpochs.replaceRows([{
										source: Source.Beacon_Rest,
										value: beaconRecentEpochReferences(
											parentEntitySelector,
											headEpoch,
											limit
										),
									}])
									fields.$$beaconEpochs.count.replaceRows([{
										source: Source.Beacon_Rest,
										value: headEpoch + 1,
									}])
								}
								if (checkpoints == null)
									throw new Error(`Beacon_Rest: finality checkpoints not returned for chain ${String(chainId)}`)

								fields.$$beaconFinalityTimestamps.replaceRows([{
									source: Source.Beacon_Rest,
									value: [beaconFinalityTimestampReference(
										parentEntitySelector,
										checkpoints,
										Date.now()
									)],
								}])
							} catch (error) {
								console.error('Beacon_Rest live beacon head failed', error)
							}
							if (signal.aborted)
								return
							timeout = setTimeout(() => { void poll() }, 12_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
				Evm: {
					$$beaconSlots: {
						select: (network) => network.slots,
						resolveCount: (network) => network.slotCount,
						continuation: (network) => descendingIntegerContinuation(
							'network-beacon-slots',
							network.slots.at(-1)?.[EntityMetaKey.Selector].slot
						),
					},
					$$beaconEpochs: {},
					$$beaconFinalityTimestamps: {},
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
						const committees = (
							(await getCommittees(
								eip155ChainId($network),
								String(slot)
							))
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
						const offset = beaconPaginationOffset(context)
						return {
							committees: committees.slice(offset, offset + resolverContextRowLimit(context)),
							committeeCount: committees.length,
							offset,
						}
					},
				},
			},
		})({
				$$beaconCommittees: {
					select: (slot) => slot.committees,
					resolveCount: (slot) => slot.committeeCount,
					continuation: (slot) => beaconCollectionContinuation(
						'slot-beacon-committees',
						slot.offset,
						slot.committees.length,
						slot.committeeCount
					),
				},
			}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getBeaconBlockSnapshot } = await import('$/sources/Beacon/Rest/queries.ts')
						const block = await getBeaconBlockSnapshot(
							eip155ChainId($network),
							slot
						)
						const limit = resolverContextRowLimit(context)
						const offset = beaconPaginationOffset(context)
						const blockSelector = {
							$network,
							root: block.root,
						}
						return {
							deposits: block.deposits
								.slice(offset, offset + limit)
								.map((deposit) => beaconDepositReference(blockSelector, deposit)),
							depositCount: block.deposits.length,
							attestations: block.attestations
								.slice(offset, offset + limit)
								.map((attestation) => beaconAttestationReference(blockSelector, attestation)),
							attestationCount: block.attestations.length,
							withdrawals: block.withdrawals
								.slice(offset, offset + limit)
								.map((withdrawal) => beaconWithdrawalReference(blockSelector, withdrawal)),
							withdrawalCount: block.withdrawals.length,
							slashings: block.slashings
								.slice(offset, offset + limit)
								.map((slashing) => beaconSlashingReference(blockSelector, slashing)),
							slashingCount: block.slashings.length,
							offset,
						}
					},
				},
			},
		})({
				$$beaconDeposits: {
					select: (slot) => slot.deposits,
					resolveCount: (slot) => slot.depositCount,
					continuation: (slot) => beaconCollectionContinuation(
						'slot-beacon-deposits',
						slot.offset,
						slot.deposits.length,
						slot.depositCount
					),
				},
				$$beaconAttestations: {
					select: (slot) => slot.attestations,
					resolveCount: (slot) => slot.attestationCount,
					continuation: (slot) => beaconCollectionContinuation(
						'slot-beacon-attestations',
						slot.offset,
						slot.attestations.length,
						slot.attestationCount
					),
				},
				$$beaconWithdrawals: {
					select: (slot) => slot.withdrawals,
					resolveCount: (slot) => slot.withdrawalCount,
					continuation: (slot) => beaconCollectionContinuation(
						'slot-beacon-withdrawals',
						slot.offset,
						slot.withdrawals.length,
						slot.withdrawalCount
					),
				},
				$$beaconSlashings: {
					select: (slot) => slot.slashings,
					resolveCount: (slot) => slot.slashingCount,
					continuation: (slot) => beaconCollectionContinuation(
						'slot-beacon-slashings',
						slot.offset,
						slot.slashings.length,
						slot.slashingCount
					),
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getCommittees } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const committees = (
							(await getCommittees(chainId))
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
						return committees.slice(0, resolverContextRowLimit(context))
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
						const offset = context.pagination.offset ?? 0
						if (!Number.isSafeInteger(offset) || offset < 0)
							throw new Error('Beacon_Rest: invalid sync committees offset')
						const startPeriod = continuationStartInteger(
							context.providerContinuationToken,
							headPeriod - offset,
							'sync committees'
						)
						if (startPeriod > headPeriod)
							throw new Error('Beacon_Rest: sync committees continuation exceeds head')
						const committees = await Promise.all(
							Array.from(
								{ length: resolverContextRowLimit(context) },
								(_, i) => startPeriod - i
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
						return {
							committees,
							periodCount: headPeriod + 1,
						}
					},
				},
			},
		})({
				Evm: {
					$$beaconSyncCommittees: {
						select: (network) => network.committees,
						resolveCount: (network) => network.periodCount,
						continuation: (network) => descendingIntegerContinuation(
							'network-beacon-sync-committees',
							network.committees.at(-1)?.[EntityMetaKey.Selector].period
						),
					},
				},
			}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						const { getBeaconBlockSnapshot, getHeadSlot } = await import('$/sources/Beacon/Rest/queries.ts')
						const chainId = Number(caip2.reference)
						const slot = safeIntegerFromDecimal(
							await getHeadSlot(chainId),
							'head slot'
						)
						const block = await getBeaconBlockSnapshot(chainId, slot)
						const limit = resolverContextRowLimit(context)
						const blockSelector = {
							$network: { caip2 },
							root: block.root,
						}
						return {
							attestations: block.attestations
								.slice(0, limit)
								.map((attestation) => beaconAttestationReference(blockSelector, attestation)),
							withdrawals: block.withdrawals
								.slice(0, limit)
								.map((withdrawal) => beaconWithdrawalReference(blockSelector, withdrawal)),
							slashings: block.slashings
								.slice(0, limit)
								.map((slashing) => beaconSlashingReference(blockSelector, slashing)),
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
							beaconFinalityTimestampReference(
								{ caip2 },
								checkpoints,
								Date.now()
							),
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
