import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.BittensorSubnet,

	label: 'Bittensor subnet',
	labelPlural: 'Bittensor subnets',

	id: type({
		$network: Network.id,
		netuid: 'number',
	}),

	fields: [
		{
			name: 'netuid',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'subnetInfoByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'dynamicInfoByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: 'hyperparamsByteLength',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: '$$metagraphTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorMetagraph_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: '$$neurons',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorNeuron,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
