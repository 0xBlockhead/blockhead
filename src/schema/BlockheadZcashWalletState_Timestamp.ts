import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadZcashWalletState_TimestampSelector {
	WalletStateTimestampMsSource = '$walletState+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadZcashWalletState_Timestamp,
	label: 'blockhead zcash wallet state timestamp',
	labelPlural: 'blockhead zcash wallet state observations',
	selectors: [
		{
			name: BlockheadZcashWalletState_TimestampSelector.WalletStateTimestampMsSource,
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
			entityType: EntityType.BlockheadZcashWalletState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balanceZatoshis',
			label: 'balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedBalanceZatoshis',
			label: 'verified balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spendableBalanceZatoshis',
			label: 'spendable balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unshieldedBalanceZatoshis',
			label: 'unshielded balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'saplingBalanceZatoshis',
			label: 'sapling balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'orchardBalanceZatoshis',
			label: 'orchard balance zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'changePendingConfirmationZatoshis',
			label: 'change pending confirmation zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valuePendingSpendabilityZatoshis',
			label: 'value pending spendability zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uneconomicValueZatoshis',
			label: 'uneconomic value zatoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastScannedHeight',
			label: 'last scanned height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainTipHeight',
			label: 'chain tip height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recoveryState',
			label: 'recovery state',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
