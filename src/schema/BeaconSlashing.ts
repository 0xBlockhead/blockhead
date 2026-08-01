// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconSlashing,
	labels: {
		singular: 'beacon slashing',
		plural: 'Beacon slashings',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInSlot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmNetworkSlotKindIndexInSlot: [
			'$network',
			'slot',
			'kind',
			'indexInSlot',
		],
	},
})
