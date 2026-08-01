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
		label: 'network',
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	transactionDigest: {
		label: 'transaction digest',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	eventIndex: {
		label: 'event index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	eventType: {
		label: 'event type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	packageId: {
		label: 'package ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	moduleName: {
		label: 'module name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
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
