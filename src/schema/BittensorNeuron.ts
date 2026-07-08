// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BittensorNeuronSelector {
	BittensorSubnetUid = 'BittensorSubnetUid',
}
export const BittensorNeuron = entity({
	entityType: EntityType.BittensorNeuron,
	label: 'Bittensor neuron',
	labelPlural: 'Bittensor neurons',
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
