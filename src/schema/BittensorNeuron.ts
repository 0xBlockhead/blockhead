import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import BittensorSubnet from '$/schema/BittensorSubnet.ts'
import { Source } from '$/sources/Source.ts'

export enum BittensorNeuronSelector {
	BittensorSubnetUid = 'bittensorSubnetUid',
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'uid',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
