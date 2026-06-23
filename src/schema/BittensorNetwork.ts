import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BittensorNetworkSelector {
	Network = 'network',
}
export default {
	entityType: EntityType.BittensorNetwork,
	label: 'bittensor network',
	labelPlural: 'bittensor networks',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$subnets',
			label: 'subnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BittensorSubnet,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
