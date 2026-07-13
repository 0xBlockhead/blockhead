// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDaQuorumSelector {
	NetworkQuorumId = 'NetworkQuorumId',
}
export const ZeroGDaQuorum = entity({
	entityType: EntityType.ZeroGDaQuorum,
	labels: {
		singular: 'zero g da quorum',
		plural: 'zero g da quorums',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	quorumId: {
		label: 'quorum ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$consensusNetwork: {
		label: 'consensus network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectionMethod: {
		label: 'selection method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$daNodes: {
		label: 'DA nodes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDaNode,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkQuorumId: [
			'$network',
			'quorumId',
		],
	},
})
