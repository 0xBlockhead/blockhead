import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadWakuNodeStateSelector {
	ConnectionIdNodeId = 'connectionId+nodeId',
}
export default {
	entityType: EntityType.BlockheadWakuNodeState,
	label: 'blockhead waku node state',
	labelPlural: 'blockhead waku node states',
	selectors: [
		{
			name: BlockheadWakuNodeStateSelector.ConnectionIdNodeId,
			fields: [
				'connectionId',
				'nodeId',
			],
		},
	],
	fields: [
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpoint',
			label: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadWakuNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$messageObservations',
			label: 'message observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadWakuMessageObservation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
