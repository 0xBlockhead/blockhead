// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum BlockheadQuilibriumNodeStateSelector {
	ConnectionIdNetwork = 'ConnectionIdNetwork',
}
export default {
	entityType: EntityType.BlockheadQuilibriumNodeState,
	label: 'blockhead quilibrium node state',
	labelPlural: 'blockhead quilibrium node states',
	selectors: [
		{
			name: BlockheadQuilibriumNodeStateSelector.ConnectionIdNetwork,
			fields: [
				'connectionId',
				'$network',
			],
		},
	],
	fields: [
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpoint',
			label: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'grpcPort',
			label: 'grpc port',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'restPort',
			label: 'REST port',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peerId',
			label: 'peer ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$frames',
			label: 'frames',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumFrame,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$provers',
			label: 'provers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumProver,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadQuilibriumNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
