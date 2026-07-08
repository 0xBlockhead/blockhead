// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ZeroGConsensusNetworkSelector {
	NetworkConsensusNetworkId = 'NetworkConsensusNetworkId',
}
export const ZeroGConsensusNetwork = entity({
	entityType: EntityType.ZeroGConsensusNetwork,
	label: 'zero g consensus network',
	labelPlural: 'zero g consensus networks',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	consensusNetworkId: {
		label: 'consensus network ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGConsensusNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.ZeroGChainScan_Rest,
		],
	},
})({
	selectors: {
		NetworkConsensusNetworkId: [
			'$network',
			'consensusNetworkId',
		],
	},
})
