// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaAllowance_TimestampSelector {
	AllowanceTimestampMsSource = 'AllowanceTimestampMsSource',
}
export default {
	entityType: EntityType.HederaAllowance_Timestamp,
	label: 'hedera allowance timestamp',
	labelPlural: 'hedera allowance observations',
	selectors: [
		{
			name: HederaAllowance_TimestampSelector.AllowanceTimestampMsSource,
			fields: [
				'$allowance',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$allowance',
			label: 'allowance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaAllowance,
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
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'approvedForAll',
			label: 'approved for all',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
