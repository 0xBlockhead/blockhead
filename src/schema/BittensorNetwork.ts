import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'

export enum BittensorNetworkSelector {
	Network = 'network',
}

export default {
	entityType: EntityType.BittensorNetwork,

	label: 'Bittensor network',
	labelPlural: 'Bittensor networks',

	selectors: [
		{
			name: BittensorNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorNetwork_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: '$$blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorBlock,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
		{
			name: '$$subnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Bittensor_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
