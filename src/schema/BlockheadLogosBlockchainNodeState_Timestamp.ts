// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadLogosBlockchainNodeState_Timestamp,
	labels: {
		singular: 'blockhead Logos blockchain node state timestamp',
		plural: 'blockhead Logos blockchain node state observations',
	},
})({
	$nodeState: {
		label: 'node state',
		entityType: EntityType.BlockheadLogosBlockchainNodeState,
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
	listenAddresses: {
		label: 'listen addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	peerCount: {
		label: 'peer count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectionCount: {
		label: 'connection count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pendingConnectionCount: {
		label: 'pending connection count',
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
