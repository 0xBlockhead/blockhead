// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidVaultEquity_TimestampSelector {
	AccountVaultTimestampMsSource = 'AccountVaultTimestampMsSource',
}
export default {
	entityType: EntityType.HyperliquidVaultEquity_Timestamp,
	label: 'hyperliquid vault equity timestamp',
	labelPlural: 'hyperliquid vault equity observations',
	selectors: [
		{
			name: HyperliquidVaultEquity_TimestampSelector.AccountVaultTimestampMsSource,
			fields: [
				'$account',
				'$vault',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidAccount,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$vault',
				label: 'vault',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidVault,
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
				name: 'equity',
				label: 'equity',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'pnl',
				label: 'pnl',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'allTimePnl',
				label: 'all time pnl',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'daysFollowing',
				label: 'days following',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'vaultEntryTimeMs',
				label: 'vault entry time ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lockupUntilMs',
				label: 'lockup until ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
