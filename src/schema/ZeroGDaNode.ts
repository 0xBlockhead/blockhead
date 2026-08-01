// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGDaNode,
	labels: {
		singular: 'zero g da node',
		plural: 'zero g da nodes',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$quorum: {
		label: 'quorum',
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpoint: {
		label: 'endpoint',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkNodeId: [
			'$network',
			'nodeId',
		],
	},
})
