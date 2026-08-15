import { slotsPerEpoch } from '$/constants/BeaconConsensus.ts'
import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
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
import type {
	BeaconchaInAttestation,
	BeaconchaInDeposit,
	BeaconchaInSlot,
	BeaconchaInValidator,
	BeaconchaInWithdrawal,
} from '$/sources/BeaconchaIn/Rest/types.ts'
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

const beaconchaInPaginationOffset = (
	context: ResolverContext
) => {
	const offset = (
		context.providerContinuationToken == null ?
			context.pagination.offset ?? 0
		:
			Number(context.providerContinuationToken)
	)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('BeaconchaIn_Rest: invalid collection pagination offset')

	return offset
}

const beaconchaInCollectionContinuation = (
	operation: string,
	offset: number,
	rowCount: number,
	totalCount: number
) => {
	const nextOffset = offset + rowCount
	const terminal = rowCount === 0 || nextOffset >= totalCount

	return {
		operation,
		target: 'beaconcha-in-rest',
		terminal,
		...(!terminal && { token: String(nextOffset) }),
	}
}

const eip155BeaconBlockApplicability = [{
	$block: {
		$network: {
			caip2: {
				namespace: 'eip155',
			},
		},
	},
}] as const

const slotBody = async (
	publicEnv: SourcePublicEnv,
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slotOrRoot: number | `0x${string}`
) => {
	const { getSlot } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
	const chainId = eip155ChainId($network)
	const slotWire = await getSlot(
		publicEnv,
		{
			chainId,
			slot: slotOrRoot,
		}
	)
	return {
		chainId,
		slot: slotWire.slot,
		$block: {
			$network,
			root: with0xHex(slotWire.blockroot),
		},
	}
}

const beaconchaInSlotHasBlock = (slot: BeaconchaInSlot) => (
	slot.status === '1'
	|| slot.status === '3'
)

const beaconchaInSlotBlockReferences = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: BeaconchaInSlot
) => {
	if (!beaconchaInSlotHasBlock(slot))
		return []

	const root = with0xHex(slot.blockroot)
	return [{
		[EntityMetaKey.Selector]: {
			$network,
			root,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconBlock, [], '$slot')]: {
				[EntityMetaKey.Selector]: {
					$network,
					slot: slot.slot,
				},
			},
			[entityFieldAddressKey(EntityType.BeaconBlock, [], '$proposer')]: {
				[EntityMetaKey.Selector]: {
					$network,
					indexInNetwork: slot.proposer,
				},
			},
			...(slot.slot > 0 && {
				[entityFieldAddressKey(EntityType.BeaconBlock, [], '$parent')]: {
					[EntityMetaKey.Selector]: {
						$network,
						root: with0xHex(slot.parentroot),
					},
				},
			}),
			[entityFieldAddressKey(EntityType.BeaconBlock, [], 'stateRoot')]: with0xHex(slot.stateroot),
			[entityFieldAddressKey(EntityType.BeaconBlock, [], 'signature')]: with0xHex(slot.signature),
		},
	}]
}

const beaconchaInSlotReference = (
	$network: EntitySelector<typeof schema, EntityType.Network>,
	slot: BeaconchaInSlot
) => ({
	[EntityMetaKey.Selector]: {
		$network,
		slot: slot.slot,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: slot.epoch,
		[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
			[EntityMetaKey.Selector]: {
				$network,
				epoch: slot.epoch,
			},
		},
		[entityFieldAddressKey(EntityType.BeaconSlot, [], '$$blocks')]: beaconchaInSlotBlockReferences($network, slot),
	},
})

const assertOptionalBlockRoot = (
	$block: {
		root: `0x${string}`
	},
	itemRoot: string | undefined,
	label: string
) => {
	if (itemRoot == null || itemRoot === '')
		return
	if (with0xHex(itemRoot) !== $block.root)
		throw new Error(`BeaconchaIn_Rest: ${label} block root does not match the selected block`)
}

const depositProofFromWire = (proof: string | null | undefined) => {
	if (proof == null || proof === '')
		return []
	const hex = with0xHex(proof).slice(2)
	if (hex.length === 0 || hex.length % 64 !== 0)
		throw new Error('BeaconchaIn_Rest: deposit proof is not 32-byte chunks')
	return Array.from(
		{ length: hex.length / 64 },
		(_, i) => `0x${hex.slice(i * 64, i * 64 + 64)}`
	)
}

const beaconchaInAttestationReference = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	attestation: BeaconchaInAttestation
) => {
	assertOptionalBlockRoot($block, attestation.block_root ?? attestation.beaconblockroot, 'attestation')
	return {
		[EntityMetaKey.Selector]: {
			$block,
			indexInBlock: attestation.block_index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'committeeIndex')]: attestation.committeeindex,
			[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'aggregationBits')]: with0xHex(attestation.aggregationbits),
		},
	}
}

const beaconchaInDepositReference = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	deposit: BeaconchaInDeposit
) => {
	assertOptionalBlockRoot($block, deposit.block_root, 'deposit')
	const pubkey = with0xHex(deposit.publickey)
	return {
		[EntityMetaKey.Selector]: {
			$block,
			indexInBlock: deposit.block_index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'pubkey')]: pubkey,
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], '$validator')]: {
				[EntityMetaKey.Selector]: {
					$network: $block.$network,
					pubkey,
				},
			},
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'withdrawalCredentials')]: with0xHex(deposit.withdrawalcredentials),
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'amountGwei')]: BigInt(deposit.amount),
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'signature')]: with0xHex(deposit.signature),
			[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'proof')]: depositProofFromWire(deposit.proof),
		},
	}
}

const beaconchaInWithdrawalReference = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	withdrawal: BeaconchaInWithdrawal,
	indexInBlock: number
) => ({
	[EntityMetaKey.Selector]: {
		$block,
		withdrawalIndex: withdrawal.withdrawalindex,
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'indexInBlock')]: indexInBlock,
		[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$validator')]: {
			[EntityMetaKey.Selector]: {
				$network: $block.$network,
				indexInNetwork: withdrawal.validatorindex,
			},
		},
		[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$account')]: {
			[EntityMetaKey.Selector]: {
				address: with0xHex(withdrawal.address),
			},
		},
		[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: BigInt(withdrawal.amount),
	},
})

const beaconchaInSlashingReference = (
	$block: EntitySelector<typeof schema, EntityType.BeaconBlock>,
	kind: 'attester' | 'proposer',
	blockIndex: number,
	itemRoot: string | undefined
) => {
	assertOptionalBlockRoot($block, itemRoot, `${kind} slashing`)
	return {
		[EntityMetaKey.Selector]: {
			$block,
			kind,
			indexInKind: blockIndex,
		},
	}
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

const beaconchaInDescendingCoordinate = (
	providerContinuationToken: string | undefined,
	label: string
) => {
	if (
		providerContinuationToken != null
		&& !/^(0|[1-9][0-9]*)$/.test(providerContinuationToken)
	)
		throw new Error(`BeaconchaIn_Rest: invalid ${label} continuation`)

	return providerContinuationToken == null ?
		undefined
	:
		Number(providerContinuationToken)
}

const beaconchaInNetworkBeaconEpochReferences = async (
	caip2: EntitySelector<typeof schema, EntityType.Network>['caip2'],
	context: ResolverContext
) => {
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
	const continuationEpoch = beaconchaInDescendingCoordinate(
		context.providerContinuationToken,
		'epochs'
	)
	const firstEpoch = continuationEpoch ?? (
		head.epoch - (context.pagination.offset ?? 0)
	)
	if (firstEpoch > head.epoch)
		throw new Error('BeaconchaIn_Rest: epochs continuation exceeds latest epoch')

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
	return {
		epochs: Array.from({
			length: Math.min(Math.max(firstEpoch + 1, 0), limit),
		}, (_value, epochOffset) => (
			firstEpoch - epochOffset
		))
			.flatMap((epoch) => (
				epoch < 0 ?
					[]
				:
					[{
						[EntityMetaKey.Selector]: {
							$network: { caip2 },
							epoch,
						},
						...(epoch === head.epoch && {
							[EntityMetaKey.Fields]: tipFields,
						}),
					}]
			)),
	}
}

const beaconchaInNetworkBeaconSlotReferences = async (
	caip2: EntitySelector<typeof schema, EntityType.Network>['caip2'],
	context: ResolverContext
) => {
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
	const continuationSlot = beaconchaInDescendingCoordinate(
		context.providerContinuationToken,
		'slots'
	)
	const firstSlot = continuationSlot ?? (
		head.slot - (context.pagination.offset ?? 0)
	)
	if (firstSlot > head.slot)
		throw new Error('BeaconchaIn_Rest: slots continuation exceeds latest slot')

	const limit = resolverContextRowLimit(context)
	const $network = { caip2 }
	const tipFields = {
		[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: head.epoch,
		[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
			[EntityMetaKey.Selector]: {
				$network,
				epoch: head.epoch,
			},
		},
		[entityFieldAddressKey(EntityType.BeaconSlot, [], '$$blocks')]: beaconchaInSlotBlockReferences($network, head),
	}
	return {
		slots: Array.from({
			length: Math.min(Math.max(firstSlot + 1, 0), limit),
		}, (_value, slotOffset) => (
			firstSlot - slotOffset
		))
			.flatMap((slot) => (
				slot < 0 ?
					[]
				:
					[{
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
							...(slot === head.slot && tipFields),
						},
					}]
			)),
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
						const offset = beaconchaInPaginationOffset(context)
						return {
							slots: slots
								.slice(offset, offset + resolverContextRowLimit(context))
								.map((slot) => beaconchaInSlotReference($network, slot)),
							slotCount: slots.length,
							offset,
						}
					},
				},
			},
		})({
			$$beaconSlots: {
				select: (snapshot) => snapshot.slots,
				resolveCount: (snapshot) => snapshot.slotCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'epoch-beacon-slots',
					snapshot.offset,
					snapshot.slots.length,
					snapshot.slotCount
				),
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
							$$blocks: beaconchaInSlotBlockReferences($network, slot),
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
			$$blocks: {
				select: (slot) => slot.$$blocks,
				resolveCount: (slot) => slot.$$blocks.length,
			},
		}),

		defineResolver({
			entityType: EntityType.BeaconSlot,
			resolve: {
				EvmNetworkSlot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, slot }, context) => {
						const {
							getSlotAttestations,
							getSlotDeposits,
							getSlotWithdrawals,
							getSlotAttesterSlashings,
							getSlotProposerSlashings,
						} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const chainId = eip155ChainId($network)
						const [
							{ $block },
							attestations,
							deposits,
							withdrawals,
							attesterSlashings,
							proposerSlashings,
						] = await Promise.all([
							slotBody(context.publicEnv, $network, slot),
							getSlotAttestations(context.publicEnv, { chainId, slot }),
							getSlotDeposits(context.publicEnv, { chainId, slot }),
							getSlotWithdrawals(context.publicEnv, { chainId, slot }),
							getSlotAttesterSlashings(context.publicEnv, { chainId, slot }),
							getSlotProposerSlashings(context.publicEnv, { chainId, slot }),
						])
						const limit = resolverContextRowLimit(context)
						const offset = beaconchaInPaginationOffset(context)
						const slashings = [
							...proposerSlashings.map((slashing) => (
								beaconchaInSlashingReference($block, 'proposer', slashing.block_index, undefined)
							)),
							...attesterSlashings.map((slashing) => (
								beaconchaInSlashingReference($block, 'attester', slashing.block_index, slashing.block_root)
							)),
						]
						return {
							attestations: attestations
								.slice(offset, offset + limit)
								.map((attestation) => beaconchaInAttestationReference($block, attestation)),
							attestationCount: attestations.length,
							deposits: deposits
								.slice(offset, offset + limit)
								.map((deposit) => beaconchaInDepositReference($block, deposit)),
							depositCount: deposits.length,
							withdrawals: withdrawals
								.slice(offset, offset + limit)
								.map((withdrawal, indexInPage) => beaconchaInWithdrawalReference($block, withdrawal, offset + indexInPage)),
							withdrawalCount: withdrawals.length,
							slashings: slashings.slice(offset, offset + limit),
							slashingCount: slashings.length,
							offset,
						}
					},
				},
			},
		})({
			$$beaconAttestations: {
				select: (snapshot) => snapshot.attestations,
				resolveCount: (snapshot) => snapshot.attestationCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'slot-beacon-attestations',
					snapshot.offset,
					snapshot.attestations.length,
					snapshot.attestationCount
				),
			},
			$$beaconDeposits: {
				select: (snapshot) => snapshot.deposits,
				resolveCount: (snapshot) => snapshot.depositCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'slot-beacon-deposits',
					snapshot.offset,
					snapshot.deposits.length,
					snapshot.depositCount
				),
			},
			$$beaconWithdrawals: {
				select: (snapshot) => snapshot.withdrawals,
				resolveCount: (snapshot) => snapshot.withdrawalCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'slot-beacon-withdrawals',
					snapshot.offset,
					snapshot.withdrawals.length,
					snapshot.withdrawalCount
				),
			},
			$$beaconSlashings: {
				select: (snapshot) => snapshot.slashings,
				resolveCount: (snapshot) => snapshot.slashingCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'slot-beacon-slashings',
					snapshot.offset,
					snapshot.slashings.length,
					snapshot.slashingCount
				),
			},
		}),

		defineResolver({
			entityType: EntityType.BeaconBlock,
			resolve: {
				NetworkRoot: {
					appliesTo: eip155NetworkApplicability,
					resolve: async ({ $network, root }, context) => {
						const {
							getSlotAttestations,
							getSlotDeposits,
							getSlotWithdrawals,
							getSlotAttesterSlashings,
							getSlotProposerSlashings,
						} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const {
							chainId,
							slot,
							$block,
						} = await slotBody(context.publicEnv, $network, root)
						const limit = resolverContextRowLimit(context)
						const offset = beaconchaInPaginationOffset(context)
						const [
							attestations,
							deposits,
							withdrawals,
							attesterSlashings,
							proposerSlashings,
						] = await Promise.all([
							getSlotAttestations(context.publicEnv, { chainId, slot }),
							getSlotDeposits(context.publicEnv, { chainId, slot }),
							getSlotWithdrawals(context.publicEnv, { chainId, slot }),
							getSlotAttesterSlashings(context.publicEnv, { chainId, slot }),
							getSlotProposerSlashings(context.publicEnv, { chainId, slot }),
						])
						const slashings = [
							...proposerSlashings.map((slashing) => (
								beaconchaInSlashingReference($block, 'proposer', slashing.block_index, undefined)
							)),
							...attesterSlashings.map((slashing) => (
								beaconchaInSlashingReference($block, 'attester', slashing.block_index, slashing.block_root)
							)),
						]
						return {
							attestations: attestations
								.slice(offset, offset + limit)
								.map((attestation) => beaconchaInAttestationReference($block, attestation)),
							attestationCount: attestations.length,
							deposits: deposits
								.slice(offset, offset + limit)
								.map((deposit) => beaconchaInDepositReference($block, deposit)),
							depositCount: deposits.length,
							withdrawals: withdrawals
								.slice(offset, offset + limit)
								.map((withdrawal, indexInPage) => beaconchaInWithdrawalReference($block, withdrawal, offset + indexInPage)),
							withdrawalCount: withdrawals.length,
							slashings: slashings.slice(offset, offset + limit),
							slashingCount: slashings.length,
							offset,
						}
					},
				},
			},
		})({
			$$attestations: {
				select: (snapshot) => snapshot.attestations,
				resolveCount: (snapshot) => snapshot.attestationCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'block-attestations',
					snapshot.offset,
					snapshot.attestations.length,
					snapshot.attestationCount
				),
			},
			$$deposits: {
				select: (snapshot) => snapshot.deposits,
				resolveCount: (snapshot) => snapshot.depositCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'block-deposits',
					snapshot.offset,
					snapshot.deposits.length,
					snapshot.depositCount
				),
			},
			$$withdrawals: {
				select: (snapshot) => snapshot.withdrawals,
				resolveCount: (snapshot) => snapshot.withdrawalCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'block-withdrawals',
					snapshot.offset,
					snapshot.withdrawals.length,
					snapshot.withdrawalCount
				),
			},
			$$slashings: {
				select: (snapshot) => snapshot.slashings,
				resolveCount: (snapshot) => snapshot.slashingCount,
				continuation: (snapshot) => beaconchaInCollectionContinuation(
					'block-slashings',
					snapshot.offset,
					snapshot.slashings.length,
					snapshot.slashingCount
				),
			},
		}),

		defineResolver({
			entityType: EntityType.BeaconAttestation,
			resolve: {
				BlockIndexInBlock: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, indexInBlock }, context) => {
						const { getSlotAttestations } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const {
							chainId,
							slot,
							$block: resolvedBlock,
						} = await slotBody(context.publicEnv, $block.$network, $block.root)
						const attestation = (
							await getSlotAttestations(
								context.publicEnv,
								{
									chainId,
									slot,
								}
							)
						).find((candidate) => candidate.block_index === indexInBlock)
						if (attestation == null)
							throw new Error(`BeaconchaIn_Rest: attestation not found at index ${String(indexInBlock)}`)

						assertOptionalBlockRoot(resolvedBlock, attestation.block_root ?? attestation.beaconblockroot, 'attestation')
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
			entityType: EntityType.BeaconDeposit,
			resolve: {
				BlockIndexInBlock: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, indexInBlock }, context) => {
						const { getSlotDeposits } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const {
							chainId,
							slot,
							$block: resolvedBlock,
						} = await slotBody(context.publicEnv, $block.$network, $block.root)
						const deposit = (
							await getSlotDeposits(
								context.publicEnv,
								{
									chainId,
									slot,
								}
							)
						).find((candidate) => candidate.block_index === indexInBlock)
						if (deposit == null)
							throw new Error(`BeaconchaIn_Rest: deposit not found at index ${String(indexInBlock)}`)

						const pubkey = with0xHex(deposit.publickey)
						assertOptionalBlockRoot(resolvedBlock, deposit.block_root, 'deposit')
						return {
							pubkey,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
									pubkey,
								},
							},
							withdrawalCredentials: with0xHex(deposit.withdrawalcredentials),
							amountGwei: BigInt(deposit.amount),
							signature: with0xHex(deposit.signature),
							proof: depositProofFromWire(deposit.proof),
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
			entityType: EntityType.BeaconWithdrawal,
			resolve: {
				BlockWithdrawalIndex: {
					appliesTo: eip155BeaconBlockApplicability,
					resolve: async ({ $block, withdrawalIndex }, context) => {
						const { getSlotWithdrawals } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const {
							chainId,
							slot,
						} = await slotBody(context.publicEnv, $block.$network, $block.root)
						const withdrawals = await getSlotWithdrawals(
							context.publicEnv,
							{
								chainId,
								slot,
							}
						)
						const indexInBlock = withdrawals.findIndex((candidate) => candidate.withdrawalindex === withdrawalIndex)
						if (indexInBlock < 0)
							throw new Error(`BeaconchaIn_Rest: withdrawal ${String(withdrawalIndex)} not found`)

						const withdrawal = withdrawals[indexInBlock]

						return {
							indexInBlock,
							$validator: {
								[EntityMetaKey.Selector]: {
									$network: $block.$network,
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
					resolve: async ({ $block, kind, indexInKind }, context) => {
						const {
							getSlotAttesterSlashings,
							getSlotProposerSlashings,
						} = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						if (kind !== 'proposer' && kind !== 'attester')
							throw new Error(`BeaconchaIn_Rest: unsupported slashing kind ${String(kind)}`)

						const {
							chainId,
							slot,
							$block: resolvedBlock,
						} = await slotBody(context.publicEnv, $block.$network, $block.root)
						if (kind === 'proposer') {
							const slashing = (
								await getSlotProposerSlashings(context.publicEnv, { chainId, slot })
							).find((candidate) => candidate.block_index === indexInKind)
							if (slashing == null)
								throw new Error(`BeaconchaIn_Rest: proposer slashing not found at index ${String(indexInKind)}`)

							return beaconchaInSlashingReference(
								resolvedBlock,
								'proposer',
								slashing.block_index,
								undefined
							)
						}

						const slashing = (
							await getSlotAttesterSlashings(context.publicEnv, { chainId, slot })
						).find((candidate) => candidate.block_index === indexInKind)
						if (slashing == null)
							throw new Error(`BeaconchaIn_Rest: attester slashing not found at index ${String(indexInKind)}`)

						return beaconchaInSlashingReference(
							resolvedBlock,
							'attester',
							slashing.block_index,
							slashing.block_root
						)
					},
				},
			},
		})({
			kind: (slashing) => slashing[EntityMetaKey.Selector].kind,
			indexInKind: (slashing) => slashing[EntityMetaKey.Selector].indexInKind,
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
					resolve: async ({ caip2 }, context) => (
						beaconchaInNetworkBeaconEpochReferences(caip2, context)
					),
				},
			},
		})({
			Evm: {
				$$beaconEpochs: {
					select: (snapshot) => snapshot.epochs,
					continuation: (snapshot) => {
						const lastEpoch = snapshot.epochs.at(-1)?.[EntityMetaKey.Selector].epoch
						return {
							operation: 'network-beacon-epochs',
							terminal: lastEpoch == null || lastEpoch === 0,
							...(lastEpoch != null && lastEpoch > 0 && {
								token: String(lastEpoch - 1),
							}),
						}
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('BeaconchaIn_Rest: Network.$$beaconEpochs requires eip155')

						const { getEpoch } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const head = await getEpoch(
							context.publicEnv,
							{
								chainId: eip155ChainId({ caip2 }),
								epoch: 'latest',
							}
						)
						return head.epoch + 1
					},
				},
			},
		})({
			Evm: {
				$$beaconEpochs: {
					resolveCount: (count) => count,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => (
						beaconchaInNetworkBeaconSlotReferences(caip2, context)
					),
				},
			},
		})({
			Evm: {
				$$beaconSlots: {
					select: (snapshot) => snapshot.slots,
					continuation: (snapshot) => {
						const lastSlot = snapshot.slots.at(-1)?.[EntityMetaKey.Selector].slot
						return {
							operation: 'network-beacon-slots',
							terminal: lastSlot == null || lastSlot === 0,
							...(lastSlot != null && lastSlot > 0 && {
								token: String(lastSlot - 1),
							}),
						}
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }, context) => {
						if (caip2.namespace !== 'eip155')
							throw new Error('BeaconchaIn_Rest: Network.$$beaconSlots requires eip155')

						const { getSlot } = await import('$/sources/BeaconchaIn/Rest/queries.ts')
						const head = await getSlot(
							context.publicEnv,
							{
								chainId: eip155ChainId({ caip2 }),
								slot: 'latest',
							}
						)
						return head.slot + 1
					},
				},
			},
		})({
			Evm: {
				$$beaconSlots: {
					resolveCount: (count) => count,
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
