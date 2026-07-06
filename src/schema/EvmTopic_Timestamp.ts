// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmTopic_TimestampSelector {
	TopicTimestampMsSource = 'TopicTimestampMsSource',
}
export default {
	entityType: EntityType.EvmTopic_Timestamp,
	label: 'EVM topic observation',
	labelPlural: 'EVM topic observations',
	selectors: [
		{
			name: EvmTopic_TimestampSelector.TopicTimestampMsSource,
			fields: [
				'$topic',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$topic',
			label: 'Topic',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmTopic,
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
			name: 'signatures',
			label: 'Signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'filteredSignatureCount',
			label: 'Filtered signature count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedCandidateCount',
			label: 'Verified candidate count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachable',
			label: 'Reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
