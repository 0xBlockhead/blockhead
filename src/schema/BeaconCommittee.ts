// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconCommittee,
	labels: {
		singular: 'beacon committee',
		plural: 'Beacon committees',
	},
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInSlot: {
		label: 'Index in slot',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	validatorIndices: {
		label: 'Validator indices',
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmNetworkSlotIndexInSlot: [
			'$network',
			'slot',
			'indexInSlot',
		],
	},
})
