import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosAccountBalance_TimestampSelector {
	AccountDenomTimestampMsSource = '$account+denom+timestampMs+source',
}
export default {
	entityType: EntityType.CosmosAccountBalance_Timestamp,
	label: 'Cosmos account balance timestamp',
	labelPlural: 'Cosmos account balance observations',
	selectors: [
		{
			name: CosmosAccountBalance_TimestampSelector.AccountDenomTimestampMsSource,
			fields: [
				'$account',
				'denom',
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
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'denom',
			label: 'denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$cosmosDenom',
			label: 'Cosmos denom',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosDenom,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spendableAmount',
			label: 'spendable amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
