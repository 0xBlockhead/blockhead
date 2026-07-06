// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroWalletState_TimestampSelector {
	WalletStateTimestampMsSource = 'WalletStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadMoneroWalletState_Timestamp,
	label: 'blockhead monero wallet state timestamp',
	labelPlural: 'blockhead monero wallet state observations',
	selectors: [
		{
			name: BlockheadMoneroWalletState_TimestampSelector.WalletStateTimestampMsSource,
			fields: [
				'$walletState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$walletState',
			label: 'wallet state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadMoneroWalletState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'height',
			label: 'Height',
			description: 'The block or ledger height in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'balanceAtomicUnits',
			label: 'balance atomic units',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlockedBalanceAtomicUnits',
			label: 'unlocked balance atomic units',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'multisigImportNeeded',
			label: 'multisig import needed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'outputsExportedAt',
			label: 'outputs exported AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keyImagesExportedAt',
			label: 'key images exported AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
