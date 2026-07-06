// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleNodeState_TimestampSelector {
	NodeStateTimestampMsSource = 'NodeStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadRadicleNodeState_Timestamp,
	label: 'blockhead radicle node state timestamp',
	labelPlural: 'blockhead radicle node state observations',
	selectors: [
		{
			name: BlockheadRadicleNodeState_TimestampSelector.NodeStateTimestampMsSource,
			fields: [
				'$nodeState',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$nodeState',
			label: 'node state',
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
			name: 'alias',
			label: 'alias',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listenAddresses',
			label: 'listen addresses',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'externalAddresses',
			label: 'external addresses',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'nodeVersion',
			label: 'node version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'policy',
			label: 'policy',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastSyncedAt',
			label: 'last synced AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
