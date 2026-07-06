// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaNodeSelector {
	NetworkNodeId = 'NetworkNodeId',
}
export default {
	entityType: EntityType.HederaNode,
	label: 'hedera node',
	labelPlural: 'hedera nodes',
	selectors: [
		{
			name: HederaNodeSelector.NetworkNodeId,
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
			entityType: EntityType.HederaNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HederaNode_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
