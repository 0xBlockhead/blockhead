// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HederaTopicMessageSelector {
	TopicSequenceNumber = 'TopicSequenceNumber',
}
export default {
	entityType: EntityType.HederaTopicMessage,
	label: 'hedera topic message',
	labelPlural: 'hedera topic messages',
	selectors: [
		{
			name: HederaTopicMessageSelector.TopicSequenceNumber,
			fields: [
				'$topic',
				'sequenceNumber',
			],
		},
	],
	fields: [
		{
			name: '$topic',
			label: 'topic',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HederaTopic,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sequenceNumber',
			label: 'sequence number',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'consensusTimestamp',
			label: 'consensus timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'runningHash',
			label: 'running hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'payerAccount',
			label: 'payer account',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'message',
			label: 'message',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chunkInfo',
			label: 'chunk info',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
