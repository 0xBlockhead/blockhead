import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum SuiCoinBalance_TimestampSelector {
	AccountCoinTypeTimestampMsSource = '$account+coinType+timestampMs+source',
}
export default {
	entityType: EntityType.SuiCoinBalance_Timestamp,
	label: 'sui coin balance timestamp',
	labelPlural: 'sui coin balance observations',
	selectors: [
		{
			name: SuiCoinBalance_TimestampSelector.AccountCoinTypeTimestampMsSource,
			fields: [
				'$account',
				'coinType',
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
			entityType: EntityType.SuiAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'coinType',
			label: 'coin type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'totalBalance',
			label: 'total balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'coinObjectCount',
			label: 'coin object count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lockedBalance',
			label: 'locked balance',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
