// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconCommitteeSelector {
	EvmNetworkSlotIndexInSlot = 'EvmNetworkSlotIndexInSlot',
}
export const BeaconCommittee = entity({
	entityType: EntityType.BeaconCommittee,
	labels: {
		singular: 'beacon committee',
		plural: 'Beacon committees',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	indexInSlot: {
		label: 'Index in slot',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	validatorIndices: {
		label: 'Validator indices',
		type: EntityFieldType.Primitive,
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
