import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGDaNodeSelector {
	NetworkNodeId = 'networkNodeId',
}

export default {
	entityType: EntityType.ZeroGDaNode,

	label: '0G DA node',
	labelPlural: '0G DA nodes',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quorum',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
