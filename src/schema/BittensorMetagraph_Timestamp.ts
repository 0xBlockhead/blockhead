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

export enum BittensorMetagraph_TimestampSelector {
	BittensorSubnetTimestampMs = 'bittensorSubnetTimestampMs',
}

export default {
	entityType: EntityType.BittensorMetagraph_Timestamp,

	label: 'Bittensor metagraph snapshot',
	labelPlural: 'Bittensor metagraph snapshots',

	selectors: [
		{
			name: BittensorMetagraph_TimestampSelector.BittensorSubnetTimestampMs,
			fields: [
				'$subnet',
				'timestampMs',
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
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
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
