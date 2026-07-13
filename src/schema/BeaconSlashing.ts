// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSlashingSelector {
	EvmNetworkSlotKindIndexInSlot = 'EvmNetworkSlotKindIndexInSlot',
}
export const BeaconSlashing = entity({
	entityType: EntityType.BeaconSlashing,
	labels: {
		singular: 'beacon slashing',
		plural: 'Beacon slashings',
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
	kind: {
		label: 'Kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	indexInSlot: {
		label: 'Index in slot',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
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
