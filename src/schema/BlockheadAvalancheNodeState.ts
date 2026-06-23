import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAvalancheNodeStateSelector {
	NodeIdNetwork = 'nodeId+network',
}
export default {
	entityType: EntityType.BlockheadAvalancheNodeState,
	label: 'blockhead avalanche node state',
	labelPlural: 'blockhead avalanche node states',
	selectors: [
		{
			name: BlockheadAvalancheNodeStateSelector.NodeIdNetwork,
			fields: [
				'nodeId',
				'network',
			],
		},
	],
	fields: [
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nodePopPublicKey',
			label: 'node pop public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nodePopProofOfPossession',
			label: 'node pop proof of possession',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
