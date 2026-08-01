// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BittensorNeuron,
	labels: {
		singular: 'Bittensor neuron',
		plural: 'Bittensor neurons',
	},
})({
	$subnet: {
		entityType: EntityType.BittensorSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	uid: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		BittensorSubnetUid: [
			'$subnet',
			'uid',
		],
	},
})
