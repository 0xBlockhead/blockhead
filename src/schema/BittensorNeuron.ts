// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BittensorNeuronSelector {
	BittensorSubnetUid = 'BittensorSubnetUid',
}
export const BittensorNeuron = entity({
	entityType: EntityType.BittensorNeuron,
	labels: {
		singular: 'Bittensor neuron',
		plural: 'Bittensor neurons',
	},
})({
	$subnet: {
		label: 'Subnet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BittensorSubnet,
		cardinality: EntityFieldCardinality.One,
	},
	uid: {
		label: 'UID',
		type: EntityFieldType.Primitive,
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
