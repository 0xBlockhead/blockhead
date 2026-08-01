// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
	labels: {
		singular: 'blockhead radicle node inventory timestamp',
		plural: 'blockhead radicle node inventory observations',
	},
})({
	$node: {
		label: 'node',
		entityType: EntityType.BlockheadRadicleNodeState,
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
	repositoryCount: {
		label: 'repository count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectedPeerCount: {
		label: 'connected peer count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	routingTableSize: {
		label: 'routing table size',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	advertisedRids: {
		label: 'advertised rids',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		NodeTimestampMsSource: [
			'$node',
			'timestampMs',
			'source',
		],
	},
})
