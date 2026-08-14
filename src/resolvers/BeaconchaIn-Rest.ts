import { slotsPerEpoch } from '$/constants/BeaconConsensus.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	resolverContextRowLimit,
	type ResolverSelectorPattern,
} from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { bindingByChainId } from '$/sources/BeaconchaIn/Rest/constants.ts'
import type { BeaconchaInValidator } from '$/sources/BeaconchaIn/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

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
		throw new Error('BeaconchaIn_Rest: network must use the eip155 CAIP-2 namespace')

	const chainId = Number(network.caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 1)
		throw new Error('BeaconchaIn_Rest: network must have a positive safe eip155 chain ID')
	if (bindingByChainId[String(chainId)] == null)
		throw new Error(`BeaconchaIn_Rest: no binding for chain ${String(chainId)}`)
	return chainId
}

const validatorObservationSlot = async (
	publicEnv: SourcePublicEnv,
	chainId: number,
	validator: BeaconchaInValidator
) => {
	if (validator.last_attestation_slot != null)
		return validator.last_attestation_slot

	const { getSlot } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
	return (
		await getSlot(
			publicEnv,
			{
				chainId,
				slot: 'latest',
			}
		)
	).slot
}

const mapValidatorObservation = (
	validator: BeaconchaInValidator
) => ({
	balanceGwei: BigInt(validator.balance),
	effectiveBalanceGwei: BigInt(validator.effective_balance),
	status: validator.status,
	slashed: validator.slashed,
	...(validator.activation_eligibility_epoch != null && {
		activationEligibilityEpoch: validator.activation_eligibility_epoch,
	}),
	...(validator.activation_epoch != null && {
		activationEpoch: validator.activation_epoch,
	}),
	...(validator.exit_epoch != null && {
		exitEpoch: validator.exit_epoch,
	}),
	...(validator.withdrawable_epoch != null && {
		withdrawableEpoch: validator.withdrawable_epoch,
	}),
	...(validator.withdrawal_credentials != null && validator.withdrawal_credentials !== '' && {
		withdrawalCredentials: with0xHex(validator.withdrawal_credentials),
	}),
})

const observationFields = (
	observation: ReturnType<typeof mapValidatorObservation>
) => (
	Object.fromEntries(
		Object.entries(observation).map(([field, value]) => [
			entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], field),
			value,
		])
	)
)

const mapValidatorSnapshot = async (
	publicEnv: SourcePublicEnv,
	$network: EntitySelector<typeof schema, EntityType.Network>,
	indexOrPubkey: number | string
) => {
	const { getValidator } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
	const chainId = eip155ChainId($network)
	const validator = await getValidator(
		publicEnv,
		{
			chainId,
			indexOrPubkey,
		}
	)
	const observationSlot = await validatorObservationSlot(publicEnv, chainId, validator)
	const observation = mapValidatorObservation(validator)
	const validatorSelector = {
		$network,
		indexInNetwork: validator.validator_index,
	}
	return {
		indexInNetwork: validator.validator_index,
		pubkey: with0xHex(validator.pubkey),
		...observation,
		timestamps: [{
			[EntityMetaKey.Selector]: {
				$validator: validatorSelector,
				slot: observationSlot,
				source: Source.BeaconchaIn_Rest,
			},
			[EntityMetaKey.Fields]: observationFields(observation),
		}],
	}
}

export default {
	source: Source.BeaconchaIn_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, epoch: epochSelector }, context) => {
						const { getEpoch } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const epoch = await getEpoch(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								epoch: epochSelector,
							}
						)
						return {
							startSlot: epoch.epoch * slotsPerEpoch,
							endSlot: (epoch.epoch * slotsPerEpoch) + slotsPerEpoch - 1,
							slotCount: slotsPerEpoch,
							finalized: epoch.finalized,
							globalParticipationRate: epoch.globalparticipationrate,
							validatorsCount: epoch.validatorscount,
							attestationsCount: epoch.attestationscount,
							attesterSlashingsCount: epoch.attesterslashingscount,
							proposerSlashingsCount: epoch.proposerslashingscount,
							withdrawalsCount: epoch.withdrawalcount,
						}
					},
				},
			},
		})({
			startSlot: (snapshot) => snapshot.startSlot,
			endSlot: (snapshot) => snapshot.endSlot,
			slotCount: (snapshot) => snapshot.slotCount,
			finalized: (snapshot) => snapshot.finalized,
			globalParticipationRate: (snapshot) => snapshot.globalParticipationRate,
			validatorsCount: (snapshot) => snapshot.validatorsCount,
			attestationsCount: (snapshot) => snapshot.attestationsCount,
			attesterSlashingsCount: (snapshot) => snapshot.attesterSlashingsCount,
			proposerSlashingsCount: (snapshot) => snapshot.proposerSlashingsCount,
			withdrawalsCount: (snapshot) => snapshot.withdrawalsCount,
		}),

		defineResolver({
			entityType: EntityType.BeaconEpoch,
			resolve: {
				EvmNetworkEpoch: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, epoch: epochSelector }, context) => {
						const { getEpochSlots } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const slots = await getEpochSlots(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								epoch: epochSelector,
							}
						)
						return {
							slots: slots
								.slice(0, resolverContextRowLimit(context))
								.map((slot) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot: slot.slot,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: slot.epoch,
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: slot.proposer,
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: with0xHex(slot.blockroot),
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: with0xHex(slot.parentroot),
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: with0xHex(slot.stateroot),
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: with0xHex(slot.signature),
										[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: slot.status === '1',
									},
								})),
							slotCount: slots.length,
						}
					},
				},
			},
		})({
			$$beaconSlots: {
				select: (snapshot) => snapshot.slots,
				resolveCount: (snapshot) => snapshot.slotCount,
			},
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot: slotSelector }, context) => {
						const { getSlot } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const slot = await getSlot(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								slot: slotSelector,
							}
						)
						return {
							epoch: slot.epoch,
							proposerIndex: slot.proposer,
							root: with0xHex(slot.blockroot),
							parentRoot: with0xHex(slot.parentroot),
							stateRoot: with0xHex(slot.stateroot),
							signature: with0xHex(slot.signature),
							canonical: slot.status === '1',
						}
					},
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
			proposerIndex: (slot) => slot.proposerIndex,
			root: (slot) => slot.root,
			parentRoot: (slot) => slot.parentRoot,
			stateRoot: (slot) => slot.stateRoot,
			signature: (slot) => slot.signature,
			canonical: (slot) => slot.canonical,
		}),

		defineResolver({
			entityType: EntityType.BeaconValidator,
			resolve: {
				NetworkIndexInNetwork: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, indexInNetwork }, context) => (
						mapValidatorSnapshot(
							context.publicEnv,
							$network,
							indexInNetwork
						)
					),
				},
				NetworkPubkey: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, pubkey }, context) => (
						mapValidatorSnapshot(
							context.publicEnv,
							$network,
							pubkey
						)
					),
				},
			},
		})({
			indexInNetwork: (validator) => validator.indexInNetwork,
			pubkey: (validator) => validator.pubkey,
			balanceGwei: (validator) => validator.balanceGwei,
			effectiveBalanceGwei: (validator) => validator.effectiveBalanceGwei,
			status: (validator) => validator.status,
			slashed: (validator) => validator.slashed,
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
					}, context) => {
						if (source !== Source.BeaconchaIn_Rest)
							throw new Error(`BeaconchaIn_Rest: unsupported source ${source}`)

						const indexOrPubkey = (
							'indexInNetwork' in $validator ?
								$validator.indexInNetwork
							:
								$validator.pubkey
						)
						const snapshot = await mapValidatorSnapshot(
							context.publicEnv,
							$validator.$network,
							indexOrPubkey
						)
						const observation = snapshot.timestamps[0]
						if (observation == null)
							throw new Error('BeaconchaIn_Rest: missing validator observation')
						if (observation[EntityMetaKey.Selector].slot !== slot)
							throw new Error(`BeaconchaIn_Rest: no validator observation at slot ${String(slot)}`)

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
							...(snapshot.withdrawalCredentials != null && {
								withdrawalCredentials: snapshot.withdrawalCredentials,
							}),
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
		}),

		defineResolver({
			entityType: EntityType.BeaconValidator,
			resolve: {
				NetworkIndexInNetwork: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, indexInNetwork }, context) => {
						const { getValidatorAttestations } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const duties = await getValidatorAttestations(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								indexOrPubkey: indexInNetwork,
							}
						)
						return {
							duties: duties
								.slice(0, resolverContextRowLimit(context))
								.map((attestation) => ({
									attesterSlot: attestation.attesterslot,
									epoch: attestation.epoch,
									inclusionSlot: attestation.inclusionslot,
									status: attestation.status,
									...(attestation.committeeindex != null && {
										committeeIndex: attestation.committeeindex,
									}),
								})),
							dutyCount: duties.length,
						}
					},
				},
				NetworkPubkey: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, pubkey }, context) => {
						const { getValidatorAttestations } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const duties = await getValidatorAttestations(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								indexOrPubkey: pubkey,
							}
						)
						return {
							duties: duties
								.slice(0, resolverContextRowLimit(context))
								.map((attestation) => ({
									attesterSlot: attestation.attesterslot,
									epoch: attestation.epoch,
									inclusionSlot: attestation.inclusionslot,
									status: attestation.status,
									...(attestation.committeeindex != null && {
										committeeIndex: attestation.committeeindex,
									}),
								})),
							dutyCount: duties.length,
						}
					},
				},
			},
		})({
			attestationDuties: {
				select: (snapshot) => snapshot.duties,
				resolveCount: (snapshot) => snapshot.dutyCount,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('BeaconchaIn_Rest: Network.$$beaconEpochs requires eip155')

						const chainId = eip155ChainId({ caip2 })
						const { getEpoch } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const head = await getEpoch(
							context.publicEnv,
							{
								chainId,
								epoch: 'latest',
							}
						)
						const limit = resolverContextRowLimit(context)
						const tipFields = {
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'startSlot')]: head.epoch * slotsPerEpoch,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'endSlot')]: (head.epoch * slotsPerEpoch) + slotsPerEpoch - 1,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'slotCount')]: slotsPerEpoch,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'finalized')]: head.finalized,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'globalParticipationRate')]: head.globalparticipationrate,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'validatorsCount')]: head.validatorscount,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'attestationsCount')]: head.attestationscount,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'attesterSlashingsCount')]: head.attesterslashingscount,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'proposerSlashingsCount')]: head.proposerslashingscount,
							[entityFieldAddressKey(EntityType.BeaconEpoch, [], 'withdrawalsCount')]: head.withdrawalcount,
						}
						return Array.from(
							{ length: limit },
							(_, i) => head.epoch - i
						)
							.flatMap((epoch, index) => (
								epoch < 0 ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: { caip2 },
											epoch,
										},
										...(index === 0 && {
											[EntityMetaKey.Fields]: tipFields,
										}),
									}]
							))
					},
				},
			},
		})({
			Evm: {
				$$beaconEpochs: (epochs) => epochs,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('BeaconchaIn_Rest: Network.$$beaconSlots requires eip155')

						const chainId = eip155ChainId({ caip2 })
						const { getSlot } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const head = await getSlot(
							context.publicEnv,
							{
								chainId,
								slot: 'latest',
							}
						)
						const limit = resolverContextRowLimit(context)
						const tipFields = {
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: head.epoch,
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: head.proposer,
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: with0xHex(head.blockroot),
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'parentRoot')]: with0xHex(head.parentroot),
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'stateRoot')]: with0xHex(head.stateroot),
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'signature')]: with0xHex(head.signature),
							[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: head.status === '1',
						}
						return Array.from(
							{ length: limit },
							(_, i) => head.slot - i
						)
							.flatMap((slot, index) => (
								slot < 0 ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: { caip2 },
											slot,
										},
										...(index === 0 && {
											[EntityMetaKey.Fields]: tipFields,
										}),
									}]
							))
					},
				},
			},
		})({
			Evm: {
				$$beaconSlots: (slots) => slots,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
