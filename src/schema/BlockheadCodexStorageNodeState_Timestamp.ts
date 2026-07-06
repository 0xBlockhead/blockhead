// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCodexStorageNodeState_TimestampSelector {
	NodeStateTimestampMsSource = 'NodeStateTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
	label: 'blockhead codex storage node state timestamp',
	labelPlural: 'blockhead codex storage node state observations',
	selectors: [
		{
			name: BlockheadCodexStorageNodeState_TimestampSelector.NodeStateTimestampMsSource,
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
			entityType: EntityType.BlockheadCodexStorageNodeState,
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
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'revision',
			label: 'revision',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repoPath',
			label: 'repo path',
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
			name: 'announceAddresses',
			label: 'announce addresses',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'peerCount',
			label: 'peer count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalBlocks',
			label: 'total blocks',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quotaMaxBytes',
			label: 'quota max bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quotaUsedBytes',
			label: 'quota used bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quotaReservedBytes',
			label: 'quota reserved bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
