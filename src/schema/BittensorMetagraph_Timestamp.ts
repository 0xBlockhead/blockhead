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
	entityType: EntityType.BittensorMetagraph_Timestamp,

	label: 'Bittensor metagraph snapshot',
	labelPlural: 'Bittensor metagraph snapshots',

	id: type({
		$subnet: BittensorSubnet.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'metagraphByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'neuronCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
