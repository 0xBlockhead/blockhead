// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BittensorMetagraph_Timestamp,
	labels: {
		singular: 'Bittensor metagraph observation',
		plural: 'Bittensor metagraph observations',
	},
})({
	$subnet: {
		entityType: EntityType.BittensorSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	metagraphByteLength: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	neuronCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubnetTimestampMsSource: [
			'$subnet',
			'timestampMs',
			'source',
		],
	},
})
