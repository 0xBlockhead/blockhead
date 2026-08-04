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
	EntityMetaKey,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { bindingByChainId } from '$/sources/BeaconchaIn/Rest/constants.ts'
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
						return (
							(await getEpochSlots(
								context.publicEnv,
								{
									chainId: eip155ChainId($network),
									epoch: epochSelector,
								}
							))
								.slice(0, resolverContextRowLimit(context))
								.map((slot) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot: slot.slot,
									},
								}))
						)
					},
				},
			},
		})({
			$$beaconSlots: (slots) => slots,
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
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getSlotAttestations } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						return (
							(await getSlotAttestations(
								context.publicEnv,
								{
									chainId: eip155ChainId($network),
									slot,
								}
							))
								.slice(0, resolverContextRowLimit(context))
								.map((attestation) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: attestation.block_index,
									},
								}))
						)
					},
				},
			},
		})({
			$$beaconAttestations: (attestations) => attestations,
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const { getSlotWithdrawals } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						return (
							(await getSlotWithdrawals(
								context.publicEnv,
								{
									chainId: eip155ChainId($network),
									slot,
								}
							))
								.slice(0, resolverContextRowLimit(context))
								.map((withdrawal) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										indexInSlot: withdrawal.withdrawalindex,
									},
								}))
						)
					},
				},
			},
		})({
			$$beaconWithdrawals: (withdrawals) => withdrawals,
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const {
							getSlotAttesterSlashings,
							getSlotProposerSlashings,
						} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						const [attesterSlashings, proposerSlashings] = await Promise.all([
							getSlotAttesterSlashings(context.publicEnv, { chainId, slot }),
							getSlotProposerSlashings(context.publicEnv, { chainId, slot }),
						])
						const limit = resolverContextRowLimit(context)
						return (
							[
								...proposerSlashings.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										kind: 'proposer' as const,
										indexInSlot: slashing.block_index,
									},
								})),
								...attesterSlashings.map((slashing) => ({
									[EntityMetaKey.Selector]: {
										$network,
										slot,
										kind: 'attester' as const,
										indexInSlot: slashing.block_index,
									},
								})),
							]
								.slice(0, limit)
						)
					},
				},
			},
		})({
			$$beaconSlashings: (slashings) => slashings,
		}),

		defineResolver({
			entityType: EntityType.BeaconAttestation,
			resolve: {
				EvmNetworkSlotIndexInSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot, indexInSlot }, context) => {
						const { getSlotAttestations } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const attestation = (
							await getSlotAttestations(
								context.publicEnv,
								{
									chainId: eip155ChainId($network),
									slot,
								}
							)
						).find((candidate) => candidate.block_index === indexInSlot)
						if (attestation == null)
							throw new Error(`BeaconchaIn_Rest: attestation not found at index ${String(indexInSlot)}`)
						return {
							committeeIndex: attestation.committeeindex,
							aggregationBits: with0xHex(attestation.aggregationbits),
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
					resolve: async ({ $network, slot, indexInSlot }, context) => {
						const { getSlotWithdrawals } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const withdrawal = (
							await getSlotWithdrawals(
								context.publicEnv,
								{
									chainId: eip155ChainId($network),
									slot,
								}
							)
						).find((candidate) => candidate.withdrawalindex === indexInSlot)
						if (withdrawal == null)
							throw new Error(`BeaconchaIn_Rest: withdrawal not found at index ${String(indexInSlot)}`)
						return {
							validatorIndex: withdrawal.validatorindex,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network,
									indexInNetwork: withdrawal.validatorindex,
								},
							},
							$account: {
								[EntityMetaKey.Selector]: {
									address: with0xHex(withdrawal.address),
								},
							},
							amountGwei: BigInt(withdrawal.amount),
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
					resolve: async ({ $network, slot, kind, indexInSlot }, context) => {
						const {
							getSlotAttesterSlashings,
							getSlotProposerSlashings,
						} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						if (kind !== 'proposer' && kind !== 'attester')
							throw new Error(`BeaconchaIn_Rest: unsupported slashing kind ${String(kind)}`)

						const slashing = (
							await (
								kind === 'proposer' ?
									getSlotProposerSlashings(context.publicEnv, { chainId, slot })
								:
									getSlotAttesterSlashings(context.publicEnv, { chainId, slot })
							)
						).find((candidate) => candidate.block_index === indexInSlot)
						if (slashing == null)
							throw new Error(`BeaconchaIn_Rest: ${kind} slashing not found at index ${String(indexInSlot)}`)
						return {
							$network,
							slot,
							kind,
							indexInSlot: slashing.block_index,
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
			entityType: EntityType.BeaconValidator,
			resolve: {
				NetworkIndexInNetwork: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, indexInNetwork }, context) => {
						const { getValidator } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const validator = await getValidator(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								indexOrPubkey: indexInNetwork,
							}
						)
						return {
							indexInNetwork: validator.validator_index,
							pubkey: with0xHex(validator.pubkey),
							balanceGwei: BigInt(validator.balance),
							effectiveBalanceGwei: BigInt(validator.effective_balance),
							status: validator.status,
							slashed: validator.slashed,
						}
					},
				},
				NetworkPubkey: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, pubkey }, context) => {
						const { getValidator } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const validator = await getValidator(
							context.publicEnv,
							{
								chainId: eip155ChainId($network),
								indexOrPubkey: pubkey,
							}
						)
						return {
							indexInNetwork: validator.validator_index,
							pubkey: with0xHex(validator.pubkey),
							balanceGwei: BigInt(validator.balance),
							effectiveBalanceGwei: BigInt(validator.effective_balance),
							status: validator.status,
							slashed: validator.slashed,
						}
					},
				},
			},
		})({
			indexInNetwork: (validator) => validator.indexInNetwork,
			pubkey: (validator) => validator.pubkey,
			balanceGwei: (validator) => validator.balanceGwei,
			effectiveBalanceGwei: (validator) => validator.effectiveBalanceGwei,
			status: (validator) => validator.status,
			slashed: (validator) => validator.slashed,
		}),
	],
} satisfies RegisteredSourceResolverModule
