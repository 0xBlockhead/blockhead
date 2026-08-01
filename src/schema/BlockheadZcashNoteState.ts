// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZcashNoteState,
	labels: {
		singular: 'blockhead zcash note state',
		plural: 'blockhead zcash note states',
	},
})({
	walletId: {
		label: 'wallet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$shieldedAction: {
		label: 'shielded action',
		entityType: EntityType.ZcashShieldedAction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pool: {
		label: 'pool',
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	noteCommitment: {
		label: 'note commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nullifier: {
		label: 'nullifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueZatoshis: {
		label: 'value zatoshis',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	diversifier: {
		label: 'diversifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recipientAddress: {
		label: 'recipient address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receivedTransactionId: {
		label: 'received transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receivedAtHeight: {
		label: 'received AT height',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadZcashNoteState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdPoolNoteCommitment: [
			'walletId',
			'pool',
			'noteCommitment',
		],
	},
})
