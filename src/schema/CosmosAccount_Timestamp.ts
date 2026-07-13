// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosAccount_TimestampSelector {
	AccountTimestampMsSource = 'AccountTimestampMsSource',
}
export const CosmosAccount_Timestamp = entity({
	entityType: EntityType.CosmosAccount_Timestamp,
	labels: {
		singular: 'Cosmos account timestamp',
		plural: 'Cosmos account observations',
	},
})({
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	accountNumber: {
		label: 'Account number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		label: 'Sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountTimestampMsSource: [
			'$account',
			'timestampMs',
			'source',
		],
	},
})
