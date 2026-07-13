// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDaNodeSelector {
	NetworkNodeId = 'NetworkNodeId',
}
export const ZeroGDaNode = entity({
	entityType: EntityType.ZeroGDaNode,
	labels: {
		singular: 'zero g da node',
		plural: 'zero g da nodes',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$quorum: {
		label: 'quorum',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	endpoint: {
		label: 'endpoint',
		type: EntityFieldType.Primitive,
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
