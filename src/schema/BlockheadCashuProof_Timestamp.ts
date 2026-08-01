// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuProof_Timestamp,
	labels: {
		singular: 'blockhead Cashu proof timestamp',
		plural: 'blockhead Cashu proof observations',
	},
})({
	$proof: {
		label: 'proof',
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	y: {
		label: 'y',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	state: {
		label: 'state',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	witness: {
		label: 'witness',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		label: 'subscription ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteId: {
		label: 'quote ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	method: {
		label: 'method',
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
