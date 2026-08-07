/**
 * Beaconcha.in REST v1 wire envelopes (fail-closed arktype).
 * @see https://docs.beaconcha.in/api-reference/
 */

import { type as arktype } from 'arktype'


const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')


export const beaconchaInEpochEnvelope = arktype({
	epoch: unsignedSafe,
	ts: 'string',
	finalized: 'boolean',
	validatorscount: unsignedSafe,
	/** Gwei aggregates can exceed Number.MAX_SAFE_INTEGER on mainnet. */
	averagevalidatorbalance: 'number >= 0',
	totalvalidatorbalance: 'number >= 0',
	globalparticipationrate: 'number',
	eligibleether: 'number >= 0',
	votedether: 'number >= 0',
	blockscount: unsignedSafe,
	proposedblocks: unsignedSafe,
	missedblocks: unsignedSafe,
	orphanedblocks: unsignedSafe,
	scheduledblocks: unsignedSafe,
	attestationscount: unsignedSafe,
	attesterslashingscount: unsignedSafe,
	proposerslashingscount: unsignedSafe,
	depositscount: unsignedSafe,
	withdrawalcount: unsignedSafe,
	voluntaryexitscount: unsignedSafe,
	rewards_exported: 'boolean',
}).onUndeclaredKey('delete')

export type BeaconchaInEpoch = typeof beaconchaInEpochEnvelope.infer


export const beaconchaInSlotEnvelope = arktype({
	slot: unsignedSafe,
	epoch: unsignedSafe,
	blockroot: nonEmptyString,
	parentroot: nonEmptyString,
	stateroot: nonEmptyString,
	signature: nonEmptyString,
	proposer: unsignedSafe,
	/** `'0'` scheduled, `'1'` proposed/canonical, `'2'` missed, `'3'` orphaned */
	status: nonEmptyString,
	'attestationscount?': unsignedSafe,
	'attesterslashingscount?': unsignedSafe,
	'proposerslashingscount?': unsignedSafe,
	'depositscount?': unsignedSafe,
	'withdrawalcount?': unsignedSafe,
	'voluntaryexitscount?': unsignedSafe,
}).onUndeclaredKey('delete')

export type BeaconchaInSlot = typeof beaconchaInSlotEnvelope.infer


export const beaconchaInValidatorEnvelope = arktype({
	validator_index: unsignedSafe,
	pubkey: nonEmptyString,
	balance: unsignedSafe,
	effective_balance: unsignedSafe,
	status: nonEmptyString,
	slashed: 'boolean',
	'activation_eligibility_epoch?': unsignedSafe,
	'activation_epoch?': unsignedSafe,
	'exit_epoch?': unsignedSafe,
	'withdrawable_epoch?': unsignedSafe,
	'withdrawal_credentials?': 'string',
	'last_attestation_slot?': unsignedSafe,
	'name?': 'string',
	'total_withdrawals?': unsignedSafe,
}).onUndeclaredKey('delete')

export type BeaconchaInValidator = typeof beaconchaInValidatorEnvelope.infer


/** @see https://docs.beaconcha.in/api-reference/slots/attestations-for-a-slot */
export const beaconchaInAttestationEnvelope = arktype({
	aggregationbits: nonEmptyString,
	block_index: unsignedSafe,
	committeeindex: unsignedSafe,
	slot: unsignedSafe,
	block_slot: unsignedSafe,
	'beaconblockroot?': 'string',
	'block_root?': 'string',
	'signature?': 'string',
	'source_epoch?': unsignedSafe,
	'source_root?': 'string',
	'target_epoch?': unsignedSafe,
	'target_root?': 'string',
	'validators?': unsignedSafe.array(),
}).onUndeclaredKey('delete')

export type BeaconchaInAttestation = typeof beaconchaInAttestationEnvelope.infer


/**
 * Per-validator attestation duty within an epoch window.
 * When `slim=true`, `week` / `week_start` / `week_end` / `committeeindex` are omitted.
 * @see https://docs.beaconcha.in/api-reference/validators/validator-attestations-history
 */
export const beaconchaInValidatorAttestationEnvelope = arktype({
	attesterslot: unsignedSafe,
	epoch: unsignedSafe,
	inclusionslot: unsignedSafe,
	/** `1` included on-chain; `0` missed */
	status: 'number.integer',
	validatorindex: unsignedSafe,
	'committeeindex?': unsignedSafe,
	'week?': unsignedSafe,
	'week_start?': 'string',
	'week_end?': 'string',
}).onUndeclaredKey('delete')

export type BeaconchaInValidatorAttestation = typeof beaconchaInValidatorAttestationEnvelope.infer


/** @see https://docs.beaconcha.in/api-reference/slots/withdrawals-for-a-slot */
export const beaconchaInWithdrawalEnvelope = arktype({
	address: nonEmptyString,
	amount: unsignedSafe,
	block_slot: unsignedSafe,
	validatorindex: unsignedSafe,
	/** Global sequential withdrawal index (same axis Beacon_Rest uses for `indexInSlot`). */
	withdrawalindex: unsignedSafe,
}).onUndeclaredKey('delete')

export type BeaconchaInWithdrawal = typeof beaconchaInWithdrawalEnvelope.infer


/** @see https://docs.beaconcha.in/api-reference/slots/attester-slashings-for-a-slot */
export const beaconchaInAttesterSlashingEnvelope = arktype({
	block_index: unsignedSafe,
	block_slot: unsignedSafe,
	'block_root?': 'string',
	'attestation1_beaconblockroot?': 'string',
	'attestation1_index?': unsignedSafe,
	'attestation1_indices?': unsignedSafe.array(),
	'attestation1_signature?': 'string',
	'attestation1_slot?': unsignedSafe,
	'attestation1_source_epoch?': unsignedSafe,
	'attestation1_source_root?': 'string',
	'attestation1_target_epoch?': unsignedSafe,
	'attestation1_target_root?': 'string',
	'attestation2_beaconblockroot?': 'string',
	'attestation2_index?': unsignedSafe,
	'attestation2_indices?': unsignedSafe.array(),
	'attestation2_signature?': 'string',
	'attestation2_slot?': unsignedSafe,
	'attestation2_source_epoch?': unsignedSafe,
	'attestation2_source_root?': 'string',
	'attestation2_target_epoch?': unsignedSafe,
	'attestation2_target_root?': 'string',
}).onUndeclaredKey('delete')

export type BeaconchaInAttesterSlashing = typeof beaconchaInAttesterSlashingEnvelope.infer


/** @see https://docs.beaconcha.in/api-reference/slots/proposer-slashings */
export const beaconchaInProposerSlashingEnvelope = arktype({
	block_index: unsignedSafe,
	block_slot: unsignedSafe,
	proposerindex: unsignedSafe,
	'header1_slot?': unsignedSafe,
	'header1_stateroot?': 'string',
	'header1_parentroot?': 'string',
	'header2_slot?': unsignedSafe,
	'header2_stateroot?': 'string',
	'header2_parentroot?': 'string',
}).onUndeclaredKey('delete')

export type BeaconchaInProposerSlashing = typeof beaconchaInProposerSlashingEnvelope.infer


export type BeaconchaInResponse<_Data> = {
	status: string
	data: _Data | null
}
