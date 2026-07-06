// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbValidator_TimestampSelector {
	ValidatorTimestampMsSource = 'ValidatorTimestampMsSource',
}
export default {
	entityType: EntityType.BnbValidator_Timestamp,
	label: 'bnb validator timestamp',
	labelPlural: 'bnb validator observations',
	selectors: [
		{
			name: BnbValidator_TimestampSelector.ValidatorTimestampMsSource,
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
			label: 'validator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbValidator,
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
			name: 'votingPower',
			label: 'voting power',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stakeAmount',
			label: 'stake amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'jailed',
			label: 'jailed',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
