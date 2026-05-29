import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import BittensorSubnet from '$/schema/BittensorSubnet.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.BittensorNeuron,

	label: 'Bittensor neuron',
	labelPlural: 'Bittensor neurons',

	id: type({
		$subnet: BittensorSubnet.id,
		uid: 'number',
	}),

	fields: [
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
