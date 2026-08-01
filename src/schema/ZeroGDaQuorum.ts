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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	quorumId: {
		label: 'quorum ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$consensusNetwork: {
		label: 'consensus network',
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectionMethod: {
		label: 'selection method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$daNodes: {
		label: 'DA nodes',
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
