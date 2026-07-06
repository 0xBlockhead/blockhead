// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDaNodeSelector {
	NetworkNodeId = 'NetworkNodeId',
}
export default {
	entityType: EntityType.ZeroGDaNode,
	label: 'zero g da node',
	labelPlural: 'zero g da nodes',
	selectors: [
		{
			name: ZeroGDaNodeSelector.NetworkNodeId,
			fields: [
				'$network',
				'nodeId',
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
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quorum',
			label: 'quorum',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$operator',
			label: 'operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpoint',
			label: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
