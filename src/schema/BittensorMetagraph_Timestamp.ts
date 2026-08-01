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
		label: 'Subnet',
		entityType: EntityType.BittensorSubnet,
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
	metagraphByteLength: {
		label: 'Metagraph bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	neuronCount: {
		label: 'Neurons',
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
