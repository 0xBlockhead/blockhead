// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCodexStorageNodeState_TimestampSelector {
	NodeStateTimestampMsSource = 'NodeStateTimestampMsSource',
}
export const BlockheadCodexStorageNodeState_Timestamp = entity({
	entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
	labels: {
		singular: 'blockhead codex storage node state timestamp',
		plural: 'blockhead codex storage node state observations',
	},
})({
	$nodeState: {
		label: 'node state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadCodexStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revision: {
		label: 'revision',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repoPath: {
		label: 'repo path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listenAddresses: {
		label: 'listen addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	announceAddresses: {
		label: 'announce addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	peerCount: {
		label: 'peer count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalBlocks: {
		label: 'total blocks',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaMaxBytes: {
		label: 'quota max bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaUsedBytes: {
		label: 'quota used bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaReservedBytes: {
		label: 'quota reserved bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeStateTimestampMsSource: [
			'$nodeState',
			'timestampMs',
			'source',
		],
	},
})
