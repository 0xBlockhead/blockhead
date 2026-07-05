// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadAvalancheNodeStateSelector {
	NodeId = 'NodeId',
}
export default {
	entityType: EntityType.BlockheadAvalancheNodeState,
	label: 'blockhead avalanche node state',
	labelPlural: 'blockhead avalanche node states',
	selectors: [
		{
			name: BlockheadAvalancheNodeStateSelector.NodeId,
			fields: [
				'nodeId',
			],
		},
	],
	fields: [
		{
				name: 'nodeId',
				label: 'node ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodeIp',
				label: 'node IP',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodePopPublicKey',
				label: 'node pop public key',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nodePopProofOfPossession',
				label: 'node pop proof of possession',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadAvalancheNodeState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
