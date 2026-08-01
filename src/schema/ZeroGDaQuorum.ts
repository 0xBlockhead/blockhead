// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGDaQuorum,
	labels: {
		singular: 'zero g da quorum',
		plural: 'zero g da quorums',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	quorumId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$consensusNetwork: {
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectionMethod: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$daNodes: {
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
