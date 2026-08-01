// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaTopicMessage,
	labels: {
		singular: 'hedera topic message',
		plural: 'hedera topic messages',
	},
})({
	$topic: {
		label: 'topic',
		entityType: EntityType.HederaTopic,
		cardinality: EntityFieldCardinality.One,
	},
	sequenceNumber: {
		label: 'sequence number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runningHash: {
		label: 'running hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payerAccount: {
		label: 'payer account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chunkInfo: {
		label: 'chunk info',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TopicSequenceNumber: [
			'$topic',
			'sequenceNumber',
		],
	},
})
