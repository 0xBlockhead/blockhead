// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosValidator_TimestampSelector {
	ValidatorTimestampMsSource = 'ValidatorTimestampMsSource',
}
export default {
	entityType: EntityType.CosmosValidator_Timestamp,
	label: 'Cosmos validator timestamp',
	labelPlural: 'Cosmos validator observations',
	selectors: [
		{
			name: CosmosValidator_TimestampSelector.ValidatorTimestampMsSource,
			fields: [
				'$validator',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$validator',
			label: 'Validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosValidator,
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
			name: 'jailed',
			label: 'Jailed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'Status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokens',
			label: 'Tokens',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'delegatorShares',
			label: 'Delegator shares',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commissionRate',
			label: 'Commission rate',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'minSelfDelegation',
			label: 'Minimum self delegation',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
