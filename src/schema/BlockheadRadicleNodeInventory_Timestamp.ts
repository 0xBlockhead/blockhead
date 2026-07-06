// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleNodeInventory_TimestampSelector {
	NodeTimestampMsSource = 'NodeTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
	label: 'blockhead radicle node inventory timestamp',
	labelPlural: 'blockhead radicle node inventory observations',
	selectors: [
		{
			name: BlockheadRadicleNodeInventory_TimestampSelector.NodeTimestampMsSource,
			fields: [
				'$node',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$node',
			label: 'node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRadicleNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'repositoryCount',
			label: 'repository count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'connectedPeerCount',
			label: 'connected peer count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'routingTableSize',
			label: 'routing table size',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'advertisedRids',
			label: 'advertised rids',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition
