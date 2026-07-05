// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BittensorSubnetSelector {
	NetworkNetuid = 'NetworkNetuid',
}
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'netuid',
				label: 'Netuid',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'name',
				label: 'Name',
				description: 'The human-readable name of the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'subnetInfoByteLength',
				label: 'Subnet info bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'dynamicInfoByteLength',
				label: 'Dynamic info bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'hyperparamsByteLength',
				label: 'Hyperparameter bytes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$metagraphTimestamps',
				label: 'Metagraph observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorMetagraph_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
		},
		{
				name: '$$neurons',
				label: 'Neurons',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorNeuron,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
