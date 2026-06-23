import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BittensorSubnetSelector {
	NetworkNetuid = 'networkNetuid',
}
export default {
	entityType: EntityType.BittensorSubnet,
	label: 'bittensor subnet',
	labelPlural: 'bittensor subnets',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'netuid',
			label: 'netuid',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subnetInfoByteLength',
			label: 'subnet info byte length',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dynamicInfoByteLength',
			label: 'dynamic info byte length',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'hyperparamsByteLength',
			label: 'hyperparams byte length',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$metagraphTimestamps',
			label: 'metagraph timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorMetagraph_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$neurons',
			label: 'neurons',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorNeuron,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
