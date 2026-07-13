// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaAllowance_TimestampSelector {
	AllowanceTimestampMsSource = 'AllowanceTimestampMsSource',
}
export const HederaAllowance_Timestamp = entity({
	entityType: EntityType.HederaAllowance_Timestamp,
	labels: {
		singular: 'hedera allowance timestamp',
		plural: 'hedera allowance observations',
	},
})({
	$allowance: {
		label: 'allowance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaAllowance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	approvedForAll: {
		label: 'approved for all',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AllowanceTimestampMsSource: [
			'$allowance',
			'timestampMs',
			'source',
		],
	},
})
