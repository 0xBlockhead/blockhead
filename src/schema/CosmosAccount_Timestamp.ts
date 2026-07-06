// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosAccount_TimestampSelector {
	AccountTimestampMsSource = 'AccountTimestampMsSource',
}
export default {
	entityType: EntityType.CosmosAccount_Timestamp,
	label: 'Cosmos account timestamp',
	labelPlural: 'Cosmos account observations',
	selectors: [
		{
			name: CosmosAccount_TimestampSelector.AccountTimestampMsSource,
			fields: [
				'$account',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'Account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
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
			name: 'accountNumber',
			label: 'Account number',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sequence',
			label: 'Sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
