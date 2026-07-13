// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuProof_TimestampSelector {
	ProofTimestampMsSource = 'ProofTimestampMsSource',
}
export const BlockheadCashuProof_Timestamp = entity({
	entityType: EntityType.BlockheadCashuProof_Timestamp,
	labels: {
		singular: 'blockhead Cashu proof timestamp',
		plural: 'blockhead Cashu proof observations',
	},
})({
	$proof: {
		label: 'proof',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadCashuProof,
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
	y: {
		label: 'y',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	witness: {
		label: 'witness',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		label: 'subscription ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteId: {
		label: 'quote ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	method: {
		label: 'method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProofTimestampMsSource: [
			'$proof',
			'timestampMs',
			'source',
		],
	},
})
