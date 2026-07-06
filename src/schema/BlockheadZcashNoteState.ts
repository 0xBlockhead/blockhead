// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZcashNoteStateSelector {
	WalletIdPoolNoteCommitment = 'WalletIdPoolNoteCommitment',
}
export default {
	entityType: EntityType.BlockheadZcashNoteState,
	label: 'blockhead zcash note state',
	labelPlural: 'blockhead zcash note states',
	selectors: [
		{
			name: BlockheadZcashNoteStateSelector.WalletIdPoolNoteCommitment,
			fields: [
				'walletId',
				'pool',
				'noteCommitment',
			],
		},
	],
	fields: [
		{
			name: 'walletId',
			label: 'wallet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$wallet',
			label: 'wallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$shieldedAction',
			label: 'shielded action',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZcashShieldedAction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pool',
			label: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'noteCommitment',
			label: 'note commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nullifier',
			label: 'nullifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueZatoshis',
			label: 'value zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'memo',
			label: 'memo',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'diversifier',
			label: 'diversifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recipientAddress',
			label: 'recipient address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'receivedTransactionId',
			label: 'received transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'receivedAtHeight',
			label: 'received AT height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadZcashNoteState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
