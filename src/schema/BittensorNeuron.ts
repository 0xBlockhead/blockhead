// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BittensorNeuronSelector {
	BittensorSubnetUid = 'BittensorSubnetUid',
}
export default {
	entityType: EntityType.BittensorNeuron,
	label: 'Bittensor neuron',
	labelPlural: 'Bittensor neurons',
	selectors: [
		{
			name: BittensorNeuronSelector.BittensorSubnetUid,
			fields: [
				'$subnet',
				'uid',
			],
		},
	],
	fields: [
		{
				name: '$subnet',
				label: 'Subnet',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BittensorSubnet,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'uid',
				label: 'UID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
