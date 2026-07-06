// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ZeroGConsensusNetworkSelector {
	NetworkConsensusNetworkId = 'NetworkConsensusNetworkId',
}
export default {
	entityType: EntityType.ZeroGConsensusNetwork,
	label: 'zero g consensus network',
	labelPlural: 'zero g consensus networks',
	selectors: [
		{
			name: ZeroGConsensusNetworkSelector.NetworkConsensusNetworkId,
			fields: [
				'$network',
				'consensusNetworkId',
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
			name: 'consensusNetworkId',
			label: 'consensus network ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGChainScan_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
