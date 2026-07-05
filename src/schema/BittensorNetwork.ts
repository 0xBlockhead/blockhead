// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BittensorNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.BittensorNetwork,
	label: 'Bittensor network',
	labelPlural: 'Bittensor networks',
	description: 'Bittensor network-specific view over a canonical Network row, with runtime observations, finalized blocks, and subnets from configured Bittensor JSON-RPC sources.',
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
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'Runtime observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorBlock,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
		},
		{
				name: '$$subnets',
				label: 'Subnets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BittensorSubnet,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Bittensor_JsonRpc,
				],
		},
	],
} as const satisfies EntityDefinition
