// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGConsensusNetwork,
	labels: {
		singular: 'zero g consensus network',
		plural: 'zero g consensus networks',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	consensusNetworkId: {
		label: 'consensus network ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
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
