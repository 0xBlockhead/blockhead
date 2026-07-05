// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum Eip8004ReputationFeedback_TimestampSelector {
	RegistrationClientAddressFeedbackIndexTimestampMsSource = 'RegistrationClientAddressFeedbackIndexTimestampMsSource',
}
export default {
	entityType: EntityType.Eip8004ReputationFeedback_Timestamp,
	label: 'EIP-8004 reputation feedback timestamp',
	labelPlural: 'EIP-8004 reputation feedback observations',
	selectors: [
		{
			name: Eip8004ReputationFeedback_TimestampSelector.RegistrationClientAddressFeedbackIndexTimestampMsSource,
			fields: [
				'$registration',
				'clientAddress',
				'feedbackIndex',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$registration',
				label: 'Registration',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Eip8004AgentRegistration,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'clientAddress',
				label: 'Client address',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'feedbackIndex',
				label: 'Feedback index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueDecimals',
				label: 'Value decimals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tag1',
				label: 'Tag 1',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tag2',
				label: 'Tag 2',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'endpoint',
				label: 'Endpoint',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feedbackUri',
				label: 'Feedback URI',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feedbackHashAlgorithm',
				label: 'Feedback hash algorithm',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feedbackHash',
				label: 'Feedback hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'revoked',
				label: 'Revoked',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionHash',
				label: 'Transaction hash',
				type: EntityFieldType.Primitive,
				primitiveType: (ZeroExHex),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
