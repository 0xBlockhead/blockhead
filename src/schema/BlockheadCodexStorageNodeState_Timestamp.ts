// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCodexStorageNodeState_Timestamp,
	labels: {
		singular: 'blockhead codex storage node state timestamp',
		plural: 'blockhead codex storage node state observations',
	},
})({
	$nodeState: {
		label: 'node state',
		entityType: EntityType.BlockheadCodexStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	version: {
		label: 'version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revision: {
		label: 'revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repoPath: {
		label: 'repo path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listenAddresses: {
		label: 'listen addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	announceAddresses: {
		label: 'announce addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	peerCount: {
		label: 'peer count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalBlocks: {
		label: 'total blocks',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaMaxBytes: {
		label: 'quota max bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaUsedBytes: {
		label: 'quota used bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quotaReservedBytes: {
		label: 'quota reserved bytes',
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
