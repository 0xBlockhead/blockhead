// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTopicMessageSelector {
	TopicSequenceNumber = 'TopicSequenceNumber',
}
export const HederaTopicMessage = entity({
	entityType: EntityType.HederaTopicMessage,
	label: 'hedera topic message',
	labelPlural: 'hedera topic messages',
})({
	$topic: {
		label: 'topic',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaTopic,
		cardinality: EntityFieldCardinality.One,
	},
	sequenceNumber: {
		label: 'sequence number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	consensusTimestamp: {
		label: 'consensus timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	runningHash: {
		label: 'running hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	payerAccount: {
		label: 'payer account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	message: {
		label: 'message',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chunkInfo: {
		label: 'chunk info',
		type: EntityFieldType.Primitive,
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
