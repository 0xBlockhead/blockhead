// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiEvent,
	labels: {
		singular: 'sui event',
		plural: 'sui events',
	},
})({
	$network: {
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionDigest: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	eventType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	packageId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTransactionDigestEventIndex: [
			'$network',
			'transactionDigest',
			'eventIndex',
		],
	},
})
