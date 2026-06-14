import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BittensorSubnetSelector {
	NetworkNetuid = 'networkNetuid',
}
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.BittensorSubnet,

	label: 'Bittensor subnet',
	labelPlural: 'Bittensor subnets',

	selectors: [
		{
			name: BittensorSubnetSelector.NetworkNetuid,
			fields: [
				'$network',
				'netuid',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
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
