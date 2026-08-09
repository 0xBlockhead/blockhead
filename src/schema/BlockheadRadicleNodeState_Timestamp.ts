// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadicleNodeState_Timestamp,
	labels: {
		singular: 'blockhead radicle node state timestamp',
		plural: 'blockhead radicle node state observations',
	},
})({
	$nodeState: {
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	alias: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listenAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	externalAddresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	nodeVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	policy: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSyncedAt: {
		primitiveType: type('number'),
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
