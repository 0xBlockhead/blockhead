// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWakuMessageObservation_Timestamp,
	labels: {
		singular: 'blockhead waku message observation timestamp',
		plural: 'blockhead waku message observation observations',
	},
})({
	$nodeState: {
		label: 'node state',
		entityType: EntityType.BlockheadWakuNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	messageHash: {
		label: 'message hash',
		primitiveType: ZeroExHex,
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
	pubsubTopic: {
		label: 'pubsub topic',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentTopic: {
		label: 'content topic',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadHash: {
		label: 'payload hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payloadSizeBytes: {
		label: 'payload size bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ephemeral: {
		label: 'ephemeral',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderPeerId: {
		label: 'sender peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	protocolPath: {
		label: 'protocol path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeStateMessageHashTimestampMsSource: [
			'$nodeState',
			'messageHash',
			'timestampMs',
			'source',
		],
	},
})
